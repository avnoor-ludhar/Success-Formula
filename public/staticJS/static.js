var buttons = document.querySelectorAll('input[type="checkbox"');

buttons.forEach((button, idx)=>{
    button.addEventListener("click", ()=>{
        if($(".idx" + idx).hasClass("strikeThrough")){
            $(".idx" + idx).removeClass("strikeThrough");
        }else{
            $(".idx" + idx).addClass("strikeThrough");
        }
    })
})
