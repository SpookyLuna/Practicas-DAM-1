
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function input(prompt) {
    return new Promise(resolve => rl.question(prompt, resolve));
}


//Contactos
let contactos = [`John,Doe,39463960P,Calle Romil 33,john@gmail.com,+34 123456789`, `Jane,Doe,39463960P,Calle Romil 33,jane@gmail.com,+34 987654321`];
let contacto_editar;

//Menu
async function menu_agenda(){
    console.log(`
        GESTIÓN DE AGENDA

        Opciones:

        1- Nuevo Contacto
        2- Editar Contacto
        3- Mostrar Contactos
        4- Borrar Contacto
        5- Salir
        `)

    let opcion = Number(await input(`
        Opcion: `));
        switch (opcion){
            case 1:
                console.clear();
                crear();
                break;
            case 2:
                console.clear();
                editar();
                break;
            case 3:
                console.clear();
                mostrar();
                break;
            case 4:
                console.clear();
                borrar()
                break;
            case 5:
                console.clear();
                rl.close(); process.exit();
            default:
                console.clear();
                menu_agenda();
                break;
        }
}


//Nuevo Contacto
let nombre, apellido, dni_comprobado, direccion_introducida, email_introducido, telefono_introducido, creando = false;

async function crear(){
    console.log(`
        GESTIÓN DE AGENDA - NUEVO CONTACTO
         `);
    creando = true;
    nombre_apellidos();
}

async function nombre_apellidos(){
    nombre = await input("Nombre: ");
    apellido = await input("Apellidos: ");
    if (creando == true){
        dni();    
    }
    else{
        let contacto_edicion = contactos[contacto_editar].split(",");
        contacto_edicion[0] = nombre;
        contacto_edicion[1] = apellido;
        contactos[contacto_editar] = contacto_edicion.join(",");
        console.clear();
        menu_agenda();
    }
}

async function dni(){
    let dni_introducido = await input("DNI: ");

    const LETRAS = [
    	"T", "R", "W", "A", "G",
        "M", "Y", "F", "P", "D",
        "X", "B", "N", "J", "Z",
        "S", "Q", "V", "H", "L",
        "C", "K", "E"
    ];


    while (dni_introducido.length !== 9 || isNaN(parseInt(dni_introducido.slice(0, 8)))){ //Comprueba que la longitud del DNIsea igual a 8 y que contenga solamente caracteres numéricos (Además de su letra).
        console.log('EL DNI introducido no es válido.')
        dni_introducido = await input("DNI: ");
    }
    let letra = parseInt(dni_introducido.slice(0, 8)) % 23;
    dni_comprobado = dni_introducido.slice(0, 8) + LETRAS[letra]; //Guarda el sumatorio del DNI 'i' y su correspondiente letra.

    if (dni_introducido === dni_comprobado){
        if (creando == true){
            direccion();
        }
        else{
            let contacto_edicion = contactos[contacto_editar].split(",");
            contacto_edicion[2] = dni_introducido;
            contactos[contacto_editar] = contacto_edicion.join(",");
            menu_agenda();
        }
    }
    else{
        console.log("El DNI introducido no es válido.");
        dni();
    }
}

async function direccion(){
    direccion_introducida = await input("Dirección: ");
    if (creando == true){
        email();
    }
    else{
        console.clear();
        menu_agenda();
    }
}

async function email(){
    email_introducido = await input("Email: ");
    let proveedor = email_introducido.split("@")[1];
    //switch (proveedor){
    if (proveedor === "gmail.com" || proveedor === "outlook.com" || proveedor === "hotmail.com"){ //Cambio a if por problemas con el siguiente input
        //case "gmail.com": case "outlook.com": case "hotmail.com":
        if (creando == true){
            telefono();
        }
        else{
            let contacto_edicion = contactos[contacto_editar].split(",");
            contacto_edicion[4] = email_introducido;
            contactos[contacto_editar] = contacto_edicion.join(",");
            console.clear();
            menu_agenda();
        }
    }
    else{
        //default:
        console.log("Has introducido un email inválido.");
        email();
    }
}

async function telefono(){
    telefono_introducido = await input("Teléfono: ");
    let prefijo = telefono_introducido.split(" ");
    if (prefijo[0][0] === "+" && telefono_introducido.split(" ")[1].length == 9){
        if (creando == true){
            console.clear();
            comprobacion();
        }
        else{
            let contacto_edicion = contactos[contacto_editar].split(",");
            contacto_edicion[5] = telefono_introducido;
            contactos[contacto_editar] = contacto_edicion.join(",");
            console.clear();
            menu_agenda();
        }
    }
    else{
        console.clear();
        console.log("Has introducido un número de telefono inválido (+XX XXXXXXXXX)")
        telefono();
    }
}

async function comprobacion(){
    console.log(`
        GESTIÓN DE AGENDA - NUEVO CONTACTO

        Nombre: ${nombre}
        Apellido: ${apellido}
        DNI: ${dni_comprobado}
        DIRECCIÓN: ${direccion_introducida}
        EMAIL: ${email_introducido}
        TELÉFONO: ${telefono_introducido}
     `)

    let opcion = await input(`
        Introduce S/N para guardar o para salir: `);

    switch (opcion){
        case "s": case "S":
            console.log(`Contacto ${nombre} agregado!`)
            contactos.push(`${nombre}, ${apellido}, ${dni_comprobado}, ${direccion_introducida}, ${email_introducido}, ${telefono_introducido}`);
            console.clear();
            menu_agenda();
            break;

        case "n": case "N":
            console.clear();
            console.log("Descartando cambios. Volviendo...")
            menu_agenda();
            break;
            
        default:
            console.clear();
            comprobacion()
            break;
    }
}

//Mostrar contacto -  Función para evitar la repetición de código
function mostrar_contacto(i){
    return `Contacto ${i} || Nombre: ${contactos[i].split(",")[0]} Apellidos: ${contactos[i].split(",")[1]} DNI: ${contactos[i].split(",")[2]} Dirección: ${contactos[i].split(",")[3]} Email: ${contactos[i].split(",")[4]} Teléfono: ${contactos[i].split(",")[5]}`;
}

//Editar contacto
async function editar (){
    console.log(`
        GESTIÓN DE AGENDA - EDITAR CONTACTO`);

    for (i = 0; i < contactos.length; i++) {
        console.log(`
            ${mostrar_contacto(i)}`);
    }
    let seleccion = Number(await input("Selecciona el contacto a editar: "));
    contacto_editar = seleccion;

    console.log(`
        GESTIÓN DE AGENDA - EDITAR CONTACTO

        Opciones:

        1- Nombre & Apellido
        2- DNI
        3- Dirección
        4- Email
        5- Teléfono
        6- Atrás
        `)


    let opcion = Number(await input(`
        Opción: `));
        switch (opcion){
            case 1:
                console.clear();
                nombre_apellidos(contactos[seleccion]);
                break;
            case 2:
                console.clear();
                dni();
                break;
            case 3:
                console.clear();
                direccion();
                break;
            case 4:
                console.clear();
                email();
                break;
            case 5:
                console.clear();
                telefono();
                break;
            case 6:
                console.clear();
                menu_agenda();
                break;
            default:
                console.clear();
                editar();
                break;
        }
}

//Mostrar contactos
async function mostrar(){
    console.log(`
        GESTIÓN DE AGENDA - MOSTRAR CONTACTOS
        `)
    for (i = 0; i < contactos.length; i++) {
        console.log(`
            ${mostrar_contacto(i)}`);
    }

    console.log(`
        Selecciona una opción:

        1- Buscar contacto
        2- Volver al menú
        
        `);

    let opcion = Number(await input(`
        Opción: `));

    switch (opcion){
        case 1:
            console.clear();
            buscar_contacto();
            break;
        case 2:
            console.clear();
            menu_agenda();
            break;
        default:
            console.clear();
            mostrar();
            break;
    }
}

//Buscar contacto
async function buscar_contacto(){
    console.log(`
        GESTIÓN DE AGENDA - BUSCAR CONTACTO

        Selecciona una opción:
    
        1- Buscar por nombre
        2- Buscar por apellido
        3- Buscar por DNI
        4- Buscar por email
        5- Buscar por teléfono
        6- Volver
        `)

    let opcion = Number(await input(`
        Opción: `));
    switch (opcion){
        case 1:
            let nombre_buscar = await input(`
                Introduce el nombre a buscar: `);
            for (let i = 0; i < contactos.length; i++) {
                let nombre = contactos[i].split(",")[0];
                if (nombre.toLowerCase() === nombre_buscar.toLowerCase()) {
                    console.log(`
                        ${mostrar_contacto(i)}`);
                    
                    let valido;
                    while (valido != true){
                        let volver = await input(`
                            ¿Volver atrás? (S): `);
                        switch (volver){
                            case "S": case "s":
                                valido = true;
                                console.clear();
                                buscar_contacto();
                                break;
                            default:
                                console.clear();
                                break;
                        }
                    }        
                }   
                else{
                    console.log(`
                        No se ha enconrado ningún contacto con ese nombre, volviendo...`);
                        buscar_contacto();
                }
            }    
            break;
        case 2:
            let apellido_buscar = await input(`
                Introduce el apellido a buscar: `);
            for (let i = 0; i <= contactos.length; i++) {
                let apellido = contactos[i].split(",")[1];
                if (apellido.toLowerCase() === apellido_buscar.toLowerCase()) {
                    console.log(`
                        ${mostrar_contacto(i)}`);                 
                    let valido;
                    while (valido != true){
                        let volver = await input(`
                            ¿Volver atrás? (S): `);
                        switch (volver){
                            case "S": case "s":
                                valido = true;
                                console.clear();
                                buscar_contacto();
                                break;
                            default:
                                console.clear();
                                break;
                    }
                }
            }    
        }
        case 3:
            let dni_buscar = await input(`
                Introduce el DNI a buscar: `);
            for (let i = 0; i <= contactos.length; i++) {
                let dni = contactos[i].split(",")[2];
                if (dni.toLowerCase() === dni_buscar.toLowerCase()) {
                    console.log(`
                        ${mostrar_contacto(i)}`);                 
                    let valido;
                    while (valido != true){
                        let volver = await input(`
                            ¿Volver atrás? (S): `);
                        switch (volver){
                            case "S": case "s":
                                valido = true;
                                console.clear();
                                buscar_contacto();
                                break;
                            default:
                                console.clear();
                                break;
                    }
                }
            }
        }
        case 4:
            let email_buscar = await input(`
                Introduce la email a buscar: `);
            for (let i = 0; i <= contactos.length; i++) {
                let email = contactos[i].split(",")[4];
                if (email.toLowerCase() === email_buscar.toLowerCase()) {
                    console.log(`
                        ${mostrar_contacto(i)}`);                
                    let valido;
                    while (valido != true){
                        let volver = await input(`
                            ¿Volver atrás? (S): `);
                        switch (volver){
                            case "S": case "s":
                                valido = true;
                                console.clear();
                                buscar_contacto();
                                break;
                            default:
                                console.clear();
                                break;
                    }
                }
            }
        }
        case 5:
            let telefono_buscar = await input("Introduce la dirección a buscar: ");
            for (let i = 0; i <= contactos.length; i++) {
                let telefono = contactos[i].split(",")[5];
                if (telefono.toLowerCase() === telefono_buscar.toLowerCase()) {
                    console.log(`
                        ${mostrar_contacto(i)}`);                
                    let valido;
                    while (valido != true){
                        let volver = await input(`
                            ¿Volver atrás? (S): `);
                        switch (volver){
                            case "S": case "s":
                                valido = true;
                                console.clear();
                                buscar_contacto();
                                break;
                            default:
                                console.clear();
                                break;
                    }
                }
            }
        }
        case 6:
            console.clear();
            menu_agenda();
            break;      
        default:
            console.clear();
            mostrar();
            break;
        }
}

//Borrar contacto
async function borrar(){
    console.log(`
        GESTIÓN DE AGENDA - BORRAR CONTACTO
        `)
    
    for (i = 0; i < contactos.length; i++) {
        console.log(`
            Contacto ${i} - ${contactos[i]}
            `);
    }

    let seleccion = Number(await input(`
        Introduce el contacto que deseas borrar: `));
    
    if (seleccion >= 0 && seleccion < contactos.length){
        console.log(`
            Contacto ${contactos[seleccion].split(",")[0, 2]} eliminado. Volviendo...`);
        contactos.splice(seleccion, 1); //Splice para reestructurar Array, delete daba problemas
        menu_agenda();
    }
    else{
        console.log(`
            Has seleccionado un contacto inexistente. Volviendo...`);
        menu_agenda();
    }
 
}

if (require.main === module) {
    menu_agenda(); // Solo ejecuta si se ejecuta directamente
}