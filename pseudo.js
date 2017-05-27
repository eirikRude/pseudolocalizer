
var options;
var patt=/(\w)+/g;
var numbers = ['一','二','三','四','五','六','七','八','九','十'];
var accents = {
    "A":"Å",
    "B":"Ƀ",
    "C":"Č",
    "D":"Ɖ",
    "E":"Ǝ",
    "F":"Ƒ",
    "G":"Ǥ",
    "H":"Ӊ",
    "I":"Ì",
    "J":"Ĵ",
    "K":"Ӄ",
    "L":"Ĺ",
    "M":"Ӎ",
    "N":"Ń",
    "O":"ϴ",
    "P":"Ƥ",
    "Q":"Ϙ",
    "R":"Я",
    "S":"Ƨ",
    "T":"Ť",
    "U":"Ų",
    "V":"Ʋ",
    "W":"Ŵ",
    "X":"Ӿ",
    "Y":"Ỵ",
    "Z":"Ƶ",
    "a":"ą",
    "b":"Ƃ",
    "c":"č",
    "d":"ď",
    "e":"ë",
    "f":"ḟ",
    "g":"ḡ",
    "h":"ḧ",
    "i":"ἳ",
    "j":"ĵ",
    "k":"ķ",
    "l":"ľ",
    "m":"ṁ",
    "n":"ņ",
    "o":"ѻ",
    "p":"ҏ",
    "q":"ɖ",
    "r":"ȑ",
    "s":"ᶊ",
    "t":"ț",
    "u":"ữ",
    "v":"ѷ",
    "w":"ŵ",
    "x":"ӿ",
    "y":"ŷ",
    "z":"ȥ"
};

/*
    Looks up the accented character
*/
function getChar(ch) {
    var uChar = accents[ch];

    if(uChar == undefined)
    {
        uChar = ch;
    }
    return uChar;
}

/*
    Accent every character.
*/
function accenter(str) {
    var l = str.length;
    var accented = [];//To avoid creating multiple strings we will add all characters to an array and join it.

    for (var i=0; i < l; i++)
    {
      accented[i] = getChar(str[i]);
    }   
    return accented.join('');
}



/*
    Add 30% to the width of the string.  Pad with [numeric values[
*/
function pad(str) {
	var len = Math.ceil(str.length/3) -4; //Get 30% of string length
	var front = '[';
	var back = ']';

    //Append half of length to front and half to back.
	for(x=0 ; x < len/2 ; x++)
    {
		front = front + numbers[x % 10];
		back = back + numbers[x % 10];
	}
	front = front+'[';
	back = back+ ']';
	str = front + str + back;
	
	return str;
}

/*
    0x202E is the RLM (Right to left) unicode marker.  0x202C Ends the specified directionality.  0x202D directs Left to Right.
    It is important to switch back to Left to Right to avoid impacting number display.
*/
function fakeBiDi(str) {
	return String.fromCharCode(0x200f,0x202E) + str + String.fromCharCode(0x202C,0x200F);
}



/*
    Recurse through DOM elements.  If element is a text element process it, otherwise recurse.
*/
function recursiveReplace(node) {

    if (node.nodeType == 3 && node.nodeName != 'SCRIPT') 
    { //This is a text node so lets process it.
    	if(node.nodeValue.trim().length > 1) 
    	{
    		var st = node.nodeValue.trim();
    		if	(options['accent']) 
            {
    			st = accenter(st);
    		}
    		if (options['bidi']) 
            {
    			st = fakeBiDi(st);
    		}
    		if ( options['pad']) 
            {
    			st = pad(st);
    		}
        	node.nodeValue = st;
        }
    } 
    else if (node.nodeType == 1 && node.nodeName != 'SCRIPT' && node.nodeName != 'STYLE') 
    { //This is a non-textual node so we will recurse
        var child = node.firstChild;
        //iterate through children
        while (child) 
        {
        	recursiveReplace(child);
        	child = child.nextSibling;
        }
    }
}


/*
    Sets the directionality of a node.
*/
function setDir(node) {
	node.setAttribute('dir','rtl');
}



/*
    Listener for messages from background script
*/
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    //Get options
    options = msg.options;
    //replace text
    recursiveReplace(document.body);
    //If options specify directionality change, change directioncality on body;)
    
    if(options['dir']){
        setDir(document.body);
    }
    
     
});



