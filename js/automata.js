let automata;
let cinta;

window.onload = function init() {  
        
    // Creamos un diagrama
    let $ = go.GraphObject.make;
    crearAutomata($);
    crearCinta($);  
}

function crearAutomata($){

    // Creamos los nodos
    let nodeDataArray = [
        { key: "0", text: "q0", loc: new go.Point(50, -50), isAccept: true},
        { key: "1", text: "q1", loc: new go.Point(250, -50)},
        { key: "2", text: "q2", loc: new go.Point(450, -50)},
    ];
        
    // Creamos las conexiones
    let linkDataArray = [
        { from: "0", to: "0", text: "a/a/R\na,a/L" },
        { from: "0", to: "1", text: "b/a/R" },
        { from: "1", to: "0", text: "a/a/L" },
        { from: "1", to: "1", text: "a/a/R\nb,a/R" },
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

function crearCinta($){

    // Creampos el array que contiene los nodos de la cinta
    let nodeDataArray = [];

    // Agregar 80 nodos en blanco
    for (let i = 0; i <= 80; i++) {
        nodeDataArray.push({ key: (i).toString(), text: " " });
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
        $(go.Shape, "Rectangle", { fill: "white", stroke: "black", stretch: go.GraphObject.Fill }),  // Establecer stretch a Fill
        $(go.TextBlock, "",
            new go.Binding("text", "name")
        ),
    );

    // Creamos el layout de la cinta
    let layout = $(go.GridLayout, {
        wrappingWidth: Infinity,  // colocar todos los nodos en una fila // colocar todos los nodos en una fila
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
  


