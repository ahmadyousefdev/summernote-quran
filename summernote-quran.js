(function ($) {
    $.extend(true, $.summernote.plugins, {
        'quran': function (context) {
            var self = this;
            var ui = $.summernote.ui,
                $note = context.layoutInfo.note,
                options = context.options,
                lang = options.langInfo;
            var quranData = [];

            // Load Quran JSON
            $.getJSON('/assets/json/quran.json', function (data) {
                quranData = data;
            });

            // Button for Quran Plugin
            context.memo('button.quran', function () {
                var button = ui.button({
                    contents: '<i class="fa-solid fa-book-quran"></i>',
                    tooltip: 'Add Quran verse',
                    click: function () {
                        self.showQuranModal();
                    }
                });
                return button.render();
            });

            // Modal Template
            this.showQuranModal = function () {
                var modal = `
                    <div class="modal fade" id="quranModal" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Search for a verse in the Quran</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <input type="text" id="quranSearch" class="form-control" placeholder="search for a verse">
                                    <select id="quranSurah" class="form-control mt-2">
                                        <option value="">select a surah</option>
                                    </select>
                                    <select id="quranAyah" class="form-control mt-2">
                                        <option value="">select a verse</option>
                                    </select>
                                    <div id="quranResult" class="mt-3"></div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary" id="insertQuran">Insert</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                if ($('#quranModal').length === 0) {
                    $('body').append(modal);
                }
                $('#quranModal').modal('show');

                self.populateSurahs();
                self.handleEvents();
            };

            // Populate Surahs
            this.populateSurahs = function () {
                var surahDropdown = $('#quranSurah');
                surahDropdown.empty().append('<option value="">select a surah</option>');
                quranData.forEach(function (surah, index) {
                    surahDropdown.append(`<option value="${index}">${surah.transliteration} (${surah.name})</option>`);
                });
            };

            // Handle Events
            this.handleEvents = function () {
                $('#quranSurah').off('change').on('change', function () {
                    var surahIndex = $(this).val();
                    var ayahDropdown = $('#quranAyah');
                    ayahDropdown.empty().append('<option value="">select a verse</option>');

                    if (surahIndex !== "") {
                        quranData[surahIndex].verses.forEach(function (ayah, index) {
                            ayahDropdown.append(`<option value="${index}">Verse ${ayah.id}</option>`);
                        });
                    }
                });

                $('#insertQuran').off('click').on('click', function () {
                    var surahIndex = $('#quranSurah').val();
                    var ayahIndex = $('#quranAyah').val();
                    if (surahIndex !== "" && ayahIndex !== "") {
                        var selectedVerse = quranData[surahIndex].verses[ayahIndex].text;
                        var selectedSurah = quranData[surahIndex].name;
                        var selectedVerseNo = quranData[surahIndex].verses[ayahIndex].id;
                        var formattedVerse = ` <span class="quran-verse">${selectedVerse}</span> ${selectedSurah} - ${selectedVerseNo} `;

                        const rng = $note.summernote('editor.getLastRange');
                        // Save the current range position (this step ensures the cursor position is preserved)
                        $note.summernote('editor.saveRange', rng);

                        // Insert the custom HTML at the cursor position
                        $note.summernote('pasteHTML', '<span>​</span>' + formattedVerse + '<span>​</span>');
                        $('#quranModal').modal('hide');

                        $('#quranModal').modal('hide');
                    }
                });

                $('#quranSearch').off('input').on('input', function () {
                    var searchTerm = $(this).val().toLowerCase(); // Normalize input
                    var results = [];

                    if (searchTerm.length > 1) {
                        quranData.forEach(function (surah, sIndex) {
                            surah.verses.forEach(function (ayah, aIndex) {
                                var normalizedText = ayah.text_plain; // Normalize Quranic text using text_plain

                                if (normalizedText.includes(searchTerm)) {
                                    results.push(`<p data-surah="${sIndex}" data-ayah="${aIndex}" class="quran-result-item">${surah.name} - ${ayah.id}: ${ayah.text}</p>`);
                                }
                            });
                        });
                    }

                    $('#quranResult').html(results.join(""));

                    // Click event for selecting a verse
                    $('.quran-result-item').off('click').on('click', function () {
                        var surahIndex = $(this).data('surah');
                        var ayahIndex = $(this).data('ayah');
                        var selectedVerse = quranData[surahIndex].verses[ayahIndex].text;
                        var selectedSurah = quranData[surahIndex].name;
                        var selectedVerseNo = quranData[surahIndex].verses[ayahIndex].id;
                        var formattedVerse = ` <span class="quran-verse">﴿ ${selectedVerse} ﴾</span> ${selectedSurah} - ${selectedVerseNo} `;

                        const rng = $note.summernote('editor.getLastRange');
                        // Save the current range position (this step ensures the cursor position is preserved)
                        $note.summernote('editor.saveRange', rng);

                        // Insert the custom HTML at the cursor position
                        $note.summernote('pasteHTML', '<span>​</span>' + formattedVerse + '<span>​</span>');
                        $('#quranModal').modal('hide');
                    });
                });
            };
        }
    });
})(jQuery);
