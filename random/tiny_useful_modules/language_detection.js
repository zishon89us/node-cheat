//------------------------------------------------------
//Find out language of text
//Web Link=> https://github.com/wooorm/franc
//------------------------------------------------------

var franc = require('franc');

var a = franc('This text is simply written in english to find its language.'),
    b = franc('Ce texte est tout simplement écrit en français pour trouver sa langue.'),
    c = franc('یہ متن صرف اس زبان تلاش کرنے اردو میں لکھا ہوا ہے'),
    d = franc('このテキストは、単純にその言語を見つけるために、日本語で書かれています');

console.log(a, b, c, d); //afr ben nno und

var all = franc.all('O Brasil caiu 26 posições');

//console.log(all);