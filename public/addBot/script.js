$(document).ready(function(){
  $(".mul-select").select2({
    placeholder: "Tags", //placeholder
    tags: false,
    theme: "dark-adminlte",
    maximumSelectionLength: 4,
    tokenSeparators: ['/',',',';'," "] 
  });
})