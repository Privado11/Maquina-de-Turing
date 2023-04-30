const cargarPalabra = document.getElementById("cargarPalabra");
cargarPalabra.addEventListener("click", agregarSimbolosALaCinta);
const iniciarRecorrido = document.getElementById("recorrido");
iniciarRecorrido.addEventListener("click", recorrerAutomata);

let $ = go.GraphObject.make;
let automata;
let cinta ;

crearAutomata();
crearCinta();

function crearAutomata(){

    // Creamos los nodos
    let nodeDataArray = [
        { key: "0", text: "q0", loc: new go.Point(  50, -50), isAccept: true},
        { key: "1", text: "q1", loc: new go.Point(250, -50)},
        { key: "2", text: "q2", loc: new go.Point(450, -50)},
    ];
        
    // Creamos las conexiones
    let linkDataArray = [
        { from: "0", to: "0", text: "a/a/R\na/a/L" },
        { from: "0", to: "1", text: "b/a/R" },
        { from: "1", to: "0", text: "a/a/L" },
        { from: "1", to: "1", text: "a/a/R\nb/a/R" },
        { from: "1", to: "2", text: "B/B/L" },
        { from: "2", to: "1", text: "a/a/L" }
    ];
    
    // Definimos el autómata y lo agregamos al div
    automata = $(go.Diagram, "automata", {
        "undoManager.isEnabled": true,
        allowMove: false,
        allowHorizontalScroll: false,
        allowVerticalScroll: false
    });
    
    // Creamos el layout de los nodos
    automata.nodeTemplate =
        $(go.Node, "Auto", 
        { width: 50, height: 50},
        new go.Binding("location", "loc"),
        $(go.Shape, "Ellipse", { fill: "white", stroke: "black", strokeWidth: 2 }),
        $(go.Panel, "Auto",
        { visible: false },
        new go.Binding("visible", "isAccept"),
        $(go.Shape, "Circle", { fill: "null", width: 40, height: 40, strokeWidth: 2})
        ),
        $(go.TextBlock, { margin: 5 }, new go.Binding("text", "text"))
    );
    
    // Creamos el layout de las conexiones
    automata.linkTemplate =
        $(go.Link,
        { curve: go.Link.Bezier, curviness: 20 },
        
        $(go.Shape, { strokeWidth: 2},
        new go.Binding("stroke", "", function(link) {
        if (link.fromNode.data.key === "0" && link.toNode.data.key === "1") {
          return "";
        }
        return "black";
        }).ofObject(),),
        $(go.Shape, { toArrow: "OpenTriangle", fill: null }),
        $(go.TextBlock, { segmentOffset: new go.Point(0, -20) }, new go.Binding("text", "text"),
        { position: new go.Point(6, 6), font: "13pt sans-serif" }, new go.Binding("text", "loc"))
    );
    
    // Agregar los datos al autómata
    automata.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    automata.isReadOnly = true;
}

function crearCinta(){

    // Agregar 80 nodos en blanco
    let nodeDataArray = [];
    for (let i = 0; i <= 80; i++) {
        nodeDataArray.push({ key: (i).toString(), text: ""});
    }

    // Definimos la cinta a la agregamos al div
    cinta = $(go.Diagram, "cinta", {
        scrollMode: go.Diagram.InfiniteScroll, // o "horizontal"
        contentAlignment: go.Spot.Center, // opcional, para centrar los nodos horizontalmente
        allowMove: false,
        allowVerticalScroll: false
    });

    // Creamos el layout de los nodos
    cinta.nodeTemplate = $(go.Node, "Auto",
        { width: 50, height: 50 },
        // go.Binding("location", "loc"),
        $(go.Shape, "Rectangle", { fill: "white", stroke: "black", stretch: go.GraphObject.Fill }),  // Establecer stretch a Fill
        $(go.TextBlock, "",
            new go.Binding("text", "text"),
            { font: "bold 16px Verdana" }
        ),
    );

    // Creamos el layout de la cinta
    let layout = $(go.GridLayout, {
        wrappingWidth: Infinity,  // colocar todos los nodos en una fila
        spacing: new go.Size(1, 1),  // espacio entre los nodos
        alignment: go.GridLayout.Position,
        cellSize: new go.Size(50, 50)  // tamaño de celda
    });
    
    // asignamos el layout a la cinta
    cinta.layout = layout;
    
    // Agregamos los datos a la cinta
    cinta.model = new go.GraphLinksModel(nodeDataArray);
    cinta.isReadOnly = true;

}

function eliminarSimbolos(){
    cinta.model.commit(function(m){
        for (let i = 0; i <= 80; i++) {
            let nodeData = m.findNodeDataForKey(i.toString());
            nodeData.text = "";
            cinta.model.updateTargetBindings(nodeData);
        }
    });
}

function agregarSimbolos(pos, x){
    cinta.model.commit(function(m){
        let nodeData = m.findNodeDataForKey((pos + 9).toString());
        nodeData.text = x;
        cinta.model.updateTargetBindings(nodeData);
    });
}

function agregarSimbolosALaCinta(){
    eliminarSimbolos();
    const texto = document.getElementById("texto").value;
    const textoAux = texto + " ";
    for (let i = 0; i < textoAux.length; i++) {
        simbolo = textoAux.charAt(i);
        agregarSimbolos(i, simbolo);
    }

    for (let i = 0; i < 8; i++) {
        setTimeout(function() {
            //scrollCinta(-50);
        }, i * 1000); // i * 1000 significa que el retraso aumenta en 1 segundo por cada iteración
    }
}

function cambiarSimboloBPorA(nodo){
    cinta.model.commit(function(m){
        let nodeData = m.findNodeDataForKey(nodo.toString());
        if(nodeData.text == "b"){
            nodeData.text = "a";
            cinta.model.updateTargetBindings(nodeData);
        }
    });
}

function scrollCinta(dx) {
    var position = cinta.position;
    cinta.position = new go.Point(position.x - dx, position.y);
} 

function reiniciarColoresDeNodosYEnlaces(){
    automata.nodes.each(function(node) {
        node.findMainElement().stroke = "black";
        node.findMainElement().fill = "white";
      });
  
    automata.links.each(function(link) {
      link.path.stroke = "black";
      link.path.strokeDashArray = [];
    });
}

function recorrerAutomata() {
    let timeoutDelayLinks = 1000;
    let timeoutDelay = 2000;
    let inputWor = document.getElementById("texto").value;
    let inputWord = inputWor;
    if(inputWor.includes("b")){
        inputWord = inputWor + " ";
    }

    let currentNode = automata.findNodeForKey("0");
    let i = 0;
    let auxIndex = inputWord.length - 1;

    reiniciarColoresDeNodosYEnlaces();
    
    function procesarSiguienteCaracter() {
        if (i < inputWord.length * 2) {
          let nextNode = null;
          let currentChar = "";
          if(i < inputWord.length){
            currentChar = inputWord.charAt(i);
          }else{
            currentChar = inputWord.charAt(auxIndex);
            auxIndex--;
          }
          
  
          automata.links.each(function(link) {
            if (link.fromNode.data.key === currentNode.data.key){
                let transicion = link.data.text.split("\n");
                transicion.forEach(trans => {
                    if(i < inputWord.length){
                        if(trans[0] === currentChar && trans[4] === "R"){
                            nextNode = automata.findNodeForKey(link.toNode.data.key);
                        }
                    }else{
                        console.log(currentChar);
                        console.log(trans[0])
                        console.log(trans[0] === currentChar)
                        if(trans[0] === currentChar && trans[4] === "L"){
                            nextNode = automata.findNodeForKey(link.toNode.data.key);
                        }
                    }
                    if(currentChar === " "){
                        nextNode = automata.findNodeForKey(link.toNode.data.key);
                    }
                });
            }
        });
  
          if (nextNode === null) {
              currentNode.findMainElement().stroke = "black";
              currentNode.findMainElement().fill = "red";
              /*setTimeout(function() {
                mostrarModal(false);
              }, 1000);*/
              return;
          }
  
          let link = null;
          automata.links.each(function(l) {
              if (l.fromNode === currentNode && l.toNode === nextNode) {
                  link = l;
                  return false;
              }
          });
        
          if (link === null) {
              return;
          }
  
          // Colorear el nodo actual y el enlace
          currentNode.findMainElement().stroke = "green";
          currentNode.findMainElement().fill = "gray";
  
          let previousNode = currentNode;
          setTimeout(function() {
              link.path.stroke = "green";
              link.path.strokeDashArray = [4, 2];
              previousNode.findMainElement().stroke = "red";
              if(i <= inputWord.length){
                scrollCinta(-50);
              }else{
              scrollCinta(50);
              }
            }, timeoutDelayLinks);
          
          // Actualizar nodo actual y contador
          //let previousNode = currentNode;
          currentNode = nextNode;
          i++;
          
        // Colorear enlace anterior rojo al pasar al siguiente nodo
        setTimeout(function() {
            link.path.stroke = "red";
            procesarSiguienteCaracter();
          }, timeoutDelay);
        } else {
            // Verificar si el nodo actual es un estado de aceptación
            if (currentNode.data.isAccept) {
                currentNode.findMainElement().stroke = "red";
                currentNode.findMainElement().fill = "yellow";
                /*setTimeout(function() {
                  mostrarModal(true);
                }, 1000);*/
            } else {
                currentNode.findMainElement().stroke = "black";
                currentNode.findMainElement().fill = "red";
                /*setTimeout(function() {
                  mostrarModal(false);
                }, 1000);*/
            }
        }
    }
      
    procesarSiguienteCaracter();
}
  







  
  



  
