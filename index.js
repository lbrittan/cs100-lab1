const API_KEY = "6435f460-b77e-11e8-bf0e-e9322ccde4db";
const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;

document.addEventListener("DOMContentLoaded", () => {
    showGalleries(url);
});

window.onhashchange = function() {
    if (location.hash == "#home") {
        showGalleries(url)
    } else if (location.hash.length == 5) {
        showObjectsTable(location.hash.substr(1))
    }
    else if (location.hash.length == 7) {
        showObject(location.hash.substr(1))
    }
};

function showGalleries(url) {
    document.querySelector("#all-objects").style.display = "none";
    document.querySelector("#all-galleries").style.display = "block";
    document.querySelector("#single-object").style.display = "none";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.records.forEach(gallery => {
                document.querySelector("#galleries").innerHTML += `
                    <li>
                        <a href="#${gallery.id}" onclick="location.hash=${gallery.id}">
                             Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
                        </a>
                    </li>
                `;
            });
            if (data.info.next) {
                showGalleries(data.info.next);
            }
        });
}

 function showObjectsTable(id) {
     document.querySelector("#all-objects").style.display = "block";
     document.querySelector("#all-galleries").style.display = "none";
     document.querySelector("#single-object").style.display = "none";
     document.querySelector("#objects-info").innerHTML = `
                <div>
                   <button onclick="location.hash='home'">Back to All Galleries</button>
                </div>
            `;
     document.querySelector("#object-table").innerHTML =  `
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>People</th>
            <th>URL</th>
          </tr>
      `;
     var pagenum = 1;
     showPage(id, pagenum);
     function showPage(id, pagenum) {
     fetch(`https://api.harvardartmuseums.org/object?apikey=${API_KEY}&gallery=${id}&page=${pagenum}`)
        .then(response => response.json())
        .then(data => {
            data.records.forEach(object => {
                var people = "";
                var peoplelist = object.people;
                if (object.people) {
                    peoplelist.forEach(person => {
                        if (person.name) {
                            if (people == "") {
                                people = (person.name)
                            } else {
                                people += (", " + person.name)
                            }
                        }
                    })}
                 document.querySelector("#object-table").innerHTML += `
                     <tr>
                         <td>
                             <a href="#${object.id}" onclick="location.hash=${object.id}">
                             ${object.title}
                             </a>
                         </td>
                         <td>
                             <img src="${object.primaryimageurl}" width="250px">
                         </td>
                         <td>
                             ${people}
                         </td>
                         <td>
                             <a href="${object.url}">${object.url}</a>
                         </td>
                     </tr>
                 `;
            });
            if (data.info.next) {
                showPage(id, (pagenum+1));
            }})
        };

}


function showObject(id) {
    document.querySelector("#single-object").style.display = "block";
    document.querySelector("#all-galleries").style.display = "none";
    document.querySelector("#all-objects").style.display = "none";
    document.querySelector("#object-info").innerHTML = ``;
    fetch(`https://api.harvardartmuseums.org/object/${id}?apikey=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector("#object-info").innerHTML += `
                <div>
                     <button onclick="location.hash=${data.gallery.galleryid}">Back to Gallery</button>
                </div>
                <div style="padding-top:25px">
                    <img src="${data.primaryimageurl}" width="500px">
                </div>
            `;
                document.querySelector("#object-info").innerHTML += `
                     <ul>
                         <li>
                            Title: <i>${data.title}</i>
                         </li>
                         <li>
                            Description: ${data.description}
                         </li>
                         <li>
                            Provenance: ${data.provenance}
                         </li>
                         <li>
                            Accession year: ${data.accessionyear}
                         </li>
                     </ul>
                 `;
            });
        }
