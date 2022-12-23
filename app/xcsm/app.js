var xhttp = new XMLHttpRequest();
var doc = document.implementation.createDocument("", "", null);
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        showResult(xhttp.responseXML);
    }
};
xhttp.open("GET", "ModeldeSupport1.xml", true);
xhttp.send();

/* const titlePartie = "/cours/partie/titre";
const titreChapitre = "/cours/partie/titre/chapitre";
 */

const ancestor_paragraphe = "//paragraphe/ancestor::notion";
const ancestor_partie = "//partie/ancestor::notion";
const ancestor_chapitre = "//chapitre/ancestor::notion";

const ancestor_chapitre_partie = "//partie/ancestor::chapitre";
// const ancestor_partie = "//partie/ancestor::notion";
// const ancestor_chapitre = "//chapitre/ancestor::notion";

const notion_node = "/cours/partie/chapitre/paragraphe/notion"

function searchElement(path, xml, type) {
    return xml.evaluate(path, xml, null, type, null);
}


var x2js = new X2JS();


const notion_list = []

function showResult(xml) {
    var txt = "";
    path = "/cours/partie/chapitre";
    console.log(xml.URL.split("/").pop().split(".")[0])
    const cours_name = xml.URL.split("/").pop().split(".")[0]
    if (xml.evaluate) {
        // var partie = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        let node, title, j = 0,
            m = 0,
            k = 0,
            notion_number, paragraph_number, chapiter_number, main_node, main_note, node_description = [];
        const tagNames = [];
        let parent;
        
        var partie = searchElement(notion_node, xml, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE) //xml.evaluate(path, xml, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        

        //description
        var main_doc = searchElement(notion_node, xml, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE)
        for (let i = 0; i < main_doc.snapshotLength; i++) {
            main_node = main_doc.snapshotItem(i);
            const str = m;
            str.toString();

            main_node.setAttribute("position", i + 1);


            node_description.push(main_node);
            m = Number.parseInt(str)
            m++
        }

        //var json = x2js.xml_str2json(main_note);
        
        

        for (let i = 0; i < partie.snapshotLength; i++) {
            const notion_content = {
                node_title: "",
                content: [],
            }
            node = partie.snapshotItem(i);
            node.setAttribute("position", i + 1);
            main_note = node.ownerDocument.documentElement.outerHTML;
            j = 0, k = 0, notion_number = 0, paragraph_number = 0;
            if (node.attributes["label"].nodeValue === "Notion par defaut") {
                parent = node.parentNode;
                notion_number = 1;
                if (parent.attributes["label"].nodeValue === "Paragraphe par defaut") {
                    paragraph_number = 1;
                    parent = parent.parentNode;

                    if (parent.attributes["label"].nodeValue === "Chapitre par defaut") {
                        chapiter_number = 1;
                        parent = parent.parentNode;
                        title = `${notion_number}.${paragraph_number}.${chapiter_number}.${parent.attributes["label"].nodeValue}`
                    } else {
                        title = `${notion_number}.${paragraph_number}.${lengthVerify(parent.attributes["label"].nodeValue)}`
                    }
                } else {
                    title = `${notion_number}.${lengthVerify(parent.attributes["label"].nodeValue)}`
                }
            } else {
                title = node.attributes["label"].nodeValue.split(".").reverse().join(".");
            }
            for (let i = 0; i < node.childElementCount; i++) {
                let str = i;
                str.toString();

                //console.log(node.outerHTML);
                //notion_content.content.push(node.children[str].innerHTML);
                notion_content.content.push(node.outerHTML);
                //console.log(node.children[str].outerHTML);
            }
            notion_content.node_title = title;
            notion_list.push(notion_content);

            //fetch(notion_content);

        }
  
        

        
        fetch(notion_list, main_note,cours_name);
        
        // Code For Internet Explorer
    } else if (window.ActiveXObject || xhttp.responseType == "msxml-document") {
        xml.setProperty("SelectionLanguage", "XPath");
        nodes = xml.selectNodes(path);
        for (i = 0; i < nodes.length; i++) {
            txt += nodes[i].childNodes[0].nodeValue + "<br>";
        }
    }
    document.getElementById("paragraph").innerHTML = txt;
}



function lengthVerify(arr) {
    const txt = arr.split(".");
    txt[1] = parseInt(txt[1], 10) + 1;
    return txt.reverse().join(".");
}

var v = new XMLWriter();
v.writeStartDocument(true);
v.writeElementString('test', 'Hello World');
v.writeAttributeString('foo', 'bar');
v.writeEndDocument();
console.log(v.flush());

function fetch(elt, description,cours_name) {
    //console.log("last", description)
    $.ajax({
        type: "post",
        url: "http://127.0.0.1:3001",
        dataType: "JSON",
        contentType: "application/json; charset=utf-8",
        traditional: true,
        processData: false,
        data: JSON.stringify({
            "notions": elt,
            "description": description,
            "name" : cours_name
        }),
    })
}