var fs = require('fs');
const express = require("express");
const parser = require("xml2json");
const cors = require("cors");
var XMLWriter = require('xml-writer');
var xpath = require('xpath'),
  dom = require('xmldom').DOMParser
const app = express();
app.use(cors());
app.use(express.json());


let i ;
let num = 0
let content;


const server = app.listen(3001, (req, res) =>
  console.log(`Server started`)
);


app.post("/", (req, res, next) => {


  content = req.body;

  if (!fs.existsSync("./cours")) {
    fs.mkdirSync("./cours");
  }
  // fs.readdir("./cours", (err, files) => {
  //   num = files.length + 1;
  //   console.log(num)
  // });
  num =  fs.readdirSync('./cours').length + 1
  if (!fs.existsSync(`./cours/cours_${num}_${content.name}`)) {
    fs.mkdirSync(`./cours/cours_${num}_${content.name}`);
  }


  const notions = req.body.notions;

  const json = parser.toJson(`${content.description}`);
  //console.log(JSON.parse(json))



  const parsed = JSON.parse(json)
  var partie = parsed.cours.partie;


  //console.log(Array.isArray(partie[0]));
  //console.log(partie[1].chapitre[1]);
  for (let i = 0; i < partie.length; i++) {
    if (Array.isArray(partie[i].chapitre) === true) {
      for (let j = 0; j < partie[i].chapitre.length; j++) {
        partie[i]["nbreChapitres"] = partie[i].chapitre.length

        if (Array.isArray(partie[i].chapitre[j].paragraphe) === true) {
          for (let k = 0; k < partie[i].chapitre[j].paragraphe.length; k++) {
            /* partie[i].chapitre[j].paragraphe[k].notion = {
              label: partie[i].chapitre[j].paragraphe[k].notion.label,
              titre: partie[i].chapitre[j].paragraphe[k].notion.titre,
            }; */
            partie[i].chapitre[j]["nbreParagraphe"] = partie[i].chapitre[j].paragraphe.length;
            //partie[i].chapitre[j].paragraphe[k].notion["position"] = k;
            if (typeof partie[i].chapitre[j].paragraphe[k].notion === 'object') {
              partie[i].chapitre[j].paragraphe[k]["nbreNotion"] = 1; //partie[i].chapitre[j].paragraphe[k].notion.length;
            }
            delete partie[i].chapitre[j].paragraphe[k].notion.contenu;
          }
        } else if (typeof partie[i].chapitre[j].paragraphe === 'object') {
          partie[i].chapitre[j]["nbreParagraphe"] = 1;
          if (typeof partie[i].chapitre[j].paragraphe.notion === 'object') {
            partie[i].chapitre[j].paragraphe["nbreNotion"] = 1;
          }
          delete partie[i].chapitre[j].paragraphe.notion.contenu;
          //console.log(partie[i].chapitre[j].paragraphe);
        }

      }
    } else if (typeof partie[i].chapitre === 'object') {
      partie[i]["nbreChapitres"] = 1;
      if (typeof partie[i].chapitre.paragraphe === 'object') {
        partie[i].chapitre["nbreParagraphe"] = 1;
        if (typeof partie[i].chapitre.paragraphe.notion === 'object') {
          partie[i].chapitre.paragraphe["nbreNotion"] = 1;
        }
      }
      delete partie[i].chapitre.paragraphe.notion.contenu;
      console.log("tsset")
      //console.log(partie[i])

    }

  }


  const desc_cour = parsed.cours;
  //console.log(desc_cour.partie)
  if (Array.isArray(desc_cour.partie) === true) {
    desc_cour.partie.forEach((elt, i) => {

      if (!desc_cour.titre) {

        if (Array.isArray(elt.chapitre) === true) {
          elt.chapitre.forEach(chap => {
            if (Array.isArray(chap.paragraphe) === true) {
              chap.paragraphe.forEach(paragraphe => {
                if (Array.isArray(paragraphe.notion) === true) {
                  paragraphe.notion.forEach(notion => {
                    notion["titrePartie"] = elt.titre;
                    notion["titreChapitre"] = chap.titre;
                    notion["titreParagraphe"] = paragraphe.titre;
                  })
                } else {
                  paragraphe.notion["titrePartie"] = elt.titre;
                  paragraphe.notion["titreChapitre"] = chap.titre;
                  paragraphe.notion["titreParagraphe"] = paragraphe.titre;
                }
              });
            } else {
              if (chap.paragraphe) {
                if (Array.isArray(chap.paragraphe.notion) === true) {
                  chap.paragraphe.notion.forEach(notion => {
                    notion["titrePartie"] = elt.titre;
                    notion["titreChapitre"] = chap.titre;
                    notion["titreParagraphe"] = paragraphe.titre;
                  })
                } else {
                  chap.paragraphe.notion["titrePartie"] = elt.titre;
                  chap.paragraphe.notion["titreChapitre"] = chap.titre;
                  chap.paragraphe.notion["titreParagraphe"] = chap.paragraphe.titre;

                }
              }
            }
          })

        } else {

          if (elt.chaptire) {
            if (elt.chapitre.paragraphe) {
              if (Array.isArray(elt.chapitre.paragraphe) === true) {
                elt.chapitre.paragraphe.forEach(paragraphe => {
                  if (Array.isArray(paragraphe.notion) === true) {
                    paragraphe.notion.forEach(notion => {
                      notion["titrePartie"] = elt.titre;
                      notion["titreChapitre"] = elt.chapitre.titre;
                      notion["titreParagraphe"] = paragraphe.titre;
                    })
                  } else {
                    paragraphe.notion["titrePartie"] = elt.titre;
                    paragraphe.notion["titreChapitre"] = elt.chapitre.titre;
                    paragraphe.notion["titreParagraphe"] = paragraphe.titre;
                  }
                });
              } else {
                if (Array.isArray(elt.chapitre.paragraphe.notion) === true) {
                  elt.chapitre.paragraphe.notion.forEach(notion => {
                    notion["titrePartie"] = elt.titre;
                    notion["titreChapitre"] = elt.chapitre.titre;
                    notion["titreParagraphe"] = elt.chapitre.paragraphe.titre;
                  })
                } else {
                  elt.chapitre.paragraphe.notion["titrePartie"] = elt.titre;
                  elt.chapitre.paragraphe.notion["titreChapitre"] = elt.chapitre.titre;
                  elt.chapitre.paragraphe.notion["titreParagraphe"] = elt.chapitre.paragraphe.titre;

                }
              }
            }
          }
        }
      }
    })
  } else {

  }

  const descriptionNotionTxt = parser.toXml(JSON.stringify(desc_cour))

  var doc = new dom().parseFromString(descriptionNotionTxt)
  var nodes = xpath.select("//notion", doc)
  let nodeConcat = ""

  for (let i = 0; i < nodes.length; i++) {
    nodeConcat += nodes[i].toString();
  }

  const notionList = `<listeNotion>${nodeConcat}</listeNotion>`
  fs.writeFile(`./cours/cours_${num}_${content.name}/descriptionNotions.xml`, notionList, function (err) {
    if (err) throw err;
    //console.log('Saved!!!!!!!!!!!!!!!!!!!!!');
  });
  const desc = parser.toXml(JSON.stringify(parsed));


  fs.writeFile(`./cours/cours_${num}_${content.name}/description.xml`, desc, function (err) {
    if (err) throw err;
    //console.log('Saved!!!!!!!!!!!!!!!!!!!!!');
  });
  if (!fs.existsSync(`./cours/cours_${num}_${content.name}/exercice`)) {
    fs.mkdirSync(`./cours/cours_${num}_${content.name}/exercice`);
  }
  if (!fs.existsSync(`./cours/cours_${num}_${content.name}/script`)) {
    fs.mkdirSync(`./cours/cours_${num}_${content.name}/script`);
  }
  if (!fs.existsSync(`./cours/cours_${num}_${content.name}/${content.name}.Images`)) {
    fs.mkdirSync(`./cours/cours_${num}_${content.name}/${content.name}.Images`);
  }










  notions.forEach(elt => {

    const txt = elt.content[0];

    fs.writeFile(`./cours/cours_${num}_${content.name}/${elt.node_title}.${num}.xml`, txt, function (err) {
      if (err) throw err;
      //console.log('Saved!');
    });
  });

});