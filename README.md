# summernote-Quran
A plugin for Summernote WYSIWYG editor that enables you to insert Quranic verses at the cursor position. It also includes the verse number and Surah name after each verse.

## Installation

### Include JS
Include the following code after Summernote:

```html
<script src="summernote-quran.js"></script>
```

### Add quran.json
You need to include the `assets/json/quran.json` file in your project. If you want to use a different path, you can modify `summernote-quran.js` and update the path from `/assets/json/quran.json` to your desired location.

### Summernote Options
To enable the plugin in Summernote, add it to your toolbar configuration, for example:

```javascript
$('.summernote').summernote({
    toolbar: [
        ['custom', ['quran']],
    ],
});
```

we used [font awesome](https://fontawesome.com/) to display the quran icon, you can use any other icon library and edit the icon in `summernote-quran.js` at `contents: '<i class="fa-solid fa-book-quran"></i>',`


## Supported Languages
Currently, this plugin only supports Arabic verses.

## Example
You can find a working example in the [dist/index.html](https://github.com/ahmadyousefdev/summernote-quran/blob/main/dist/index.html) file.

## Sources
We used the [Quran JSON](https://github.com/risan/quran-json) package to retrieve the Quranic verses, but we have modified it by adding a plain_text field for better and faster search functionality.