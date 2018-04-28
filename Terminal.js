function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    {
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}

class command {
  constructor(_tag, _func) {
    if (_tag.indexOf(' ') == -1) {
      this.tag = _tag;
      this.func = _func;
    }
  }
}

class Terminal {

  constructor(_prompt, _terminal, _template, _body, _banner, _stdOup) {

    this.terminal = _terminal; //Element for displaying the Terminal
    this.commandIdx = 0;
    this.stdOup = _stdOup.cloneNode(true);
    this.history = []
    this.commandLine = []
    this.command = {}

    this.h = function(e) {

      if (e.keyCode === 13) {
        var caller = e.target || e.srcElement;
        e.preventDefault(); //disable nextline
        caller.setAttribute("contenteditable", false)

        // Process the command here

        console.log(caller)
        let str = caller.innerHTML
        this.genStdOup(str)

        // End of command

        let newNode = this.template.cloneNode(true);
        this.commandIdx+=1;
        newNode.id = "cli_"+this.commandIdx.toString();
        newNode.getElementsByClassName("input")[0].onkeydown = this.h.bind(this);
        this.terminal.appendChild(newNode);
        newNode.focus();
        selectElementContents(newNode.getElementsByClassName("input")[0])
        window.scrollBy(0,999999999);

      }

    }

    this.focus_inp = function(e) {
      let target = document.getElementById("cli_"+this.commandIdx.toString()).getElementsByClassName("input")[0]
      setEndOfContenteditable(target)
    }

    _template.getElementsByClassName("input")[0].onkeydown = this.h.bind(this);
    this.template = _template.cloneNode(true);

    _banner.onclick = this.focus_inp.bind(this)

    this.pushNewCommandLine = function() {
      this.terminal.appendChild(this.template.cloneNode(true));
    }

    _template.focus()
    selectElementContents(_template.getElementsByClassName("input")[0])

  }

  genStdOup(oup) {
    oup = oup.replace(/(?:\r\n|\r|\n)/g, '<br />');
    let newOup = this.stdOup.cloneNode(true);
    newOup.innerHTML += oup;
    this.terminal.appendChild(newOup);
  }

}
