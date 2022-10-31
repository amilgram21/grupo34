$(document).ready(main);

var manu_expandido = true;

function main() {
    $('.menu_bar').click(function () {
        if (manu_expandido) {
            $('nav').animate({
                left: '0'
            });
        } else {
            $('nav').animate({
                left: '-100%'
            });
        }
        manu_expandido = !manu_expandido;
    });

};

const aVideos = [
    {
        id: 1,
        video: "https://www.youtube.com/embed/WHFLQGfM7EE",
        titulo: "Clase HTML 01",
        active: true,
    },
    {
        id: 2,
        video: "https://www.youtube.com/embed/imC-qNhYcvs",
        titulo: "Clase HTML 02",
        active: false,
    },
    {
        id: 3,
        video: "https://www.youtube.com/embed/Q5wkoCwsL1A",
        titulo: "Clase CSS 01",
        active: false,
    },
    {
        id: 4,
        video: "https://www.youtube.com/embed/ZoSTl-kOPi4",
        titulo: "Clase CSS 02",
        active: false,
    },
    {
        id: 5,
        video: "https://www.youtube.com/embed/D7QlAtra_jk",
        titulo: "Clase Bootstrap",
        active: false,
    },
    {
        id: 6,
        video: "https://www.youtube.com/embed/6mOFuraWjxw",
        titulo: "Clase Git / GitHub",
        active: false,
    },
];

function createTags() {
    aVideos.forEach(video => {
        var span = `<a class="tag ${(video.active ? "tag_activo" : "")}" href="javascript:void(0);" attr-id="${video.id}">${video.titulo}</a>`;
        $(".tag_container").append(span)
    });
}

createTags();

$(".tag").click(function (el) {
    $(".tag").removeClass("tag_activo");
    $(this).addClass("tag_activo");

    var idClickeado = $(this).attr("attr-id");
    var video = aVideos.filter(video => video.id == idClickeado)[0];
    console.log(video.video);
    $(".iframe").attr("src", video.video);
});

/**/

/*API REST scripts*/

function openForm() {
    $(".form_nuevoUsuario").toggle();
}

function getData() {

    $("#listado_usuarios").hide();
    $("#loading_p").show();

    let token = 'Bearer a6cf733ff6a4daf5680855540171824b7203aab851483a54cbabcaf9e531c4f8';
    let url = "https://gorest.co.in/public/v2/users";
    let contenido = "";

    $.ajax({
        url: url,
        data: {},
        headers: { "Authorization": token },
        success: function (resp) {
            $("#loading_p").hide();
            $("#listado_usuarios").show();
            let userDiv = '<div class="usuario">\
                                <div class="usuario_perfil">\
                                    <img src="images/generic_user.png" alt="%NOMBRE%" title="%NOMBRE%">\
                                    <div class="usuario_datos">\
                                        <p class="usuario_nombre">%NOMBRE%</p>\
                                        <p class="usuario_genero"><i class="fa fa-%GENDER%">&nbsp;</i>%GENERO_DESCRIPCION%</p>\
                                        \
                                    </div>\
                                    <p class="usuario_mail">%EMAIL%</p>\
                                </div>\
                            </div>';
            for (let i = 0; i < resp.length; i++) {
                const email = resp[i].email;
                const gender = resp[i].gender;
                const id = resp[i].id;
                const name = resp[i].name;
                let div = replaceAll(userDiv, "%NOMBRE%", id + " " + name);
                div = replaceAll(div, "%EMAIL%", email);
                div = replaceAll(div, "%GENDER%", gender);
                div = replaceAll(div, "%GENERO_DESCRIPCION%", gender == "male" ? "Hombre" : "Mujer");
                contenido += div;
            }

            $(".contenedor_usuarios").html(contenido);
        },
        dataType: "json"
    });
}

getData();

function postUser() {
    let nombre = $("#nombre").val();
    let email = $("#email").val();
    let gender = $("#gender").val();

    if (nombre == null || nombre == undefined || nombre == "") {
        $("#texto_error").html("EL NOMBRE NO ES VÁLIDO");
        $("#lb").lightbox_me({
            centered: true,
        });
        return;
    }
    
    if (!validarEmail(email)) {
        $("#texto_error").html("EL EMAIL NO ES VÁLIDO");
        $("#lb").lightbox_me({
            centered: true,
        });
        return;
    }
    let token = 'a6cf733ff6a4daf5680855540171824b7203aab851483a54cbabcaf9e531c4f8';
    let url = "https://gorest.co.in/public/v2/users?access-token=" + token;
    let usuario = {
        "name": nombre,
        "gender": gender,
        "email": email,
        "status": "active"
    };

    $.ajax({
        url: url,
        data: usuario,
        success: function (resp) {
            $("#texto_error").html("DATOS GUARDADOS CORRECTAMENTE");
            $("#lb").lightbox_me({
                centered: true,
            });

            $("#nombre").val("");
            $("#email").val("");

            openForm();
            getData();
        },
        dataType: "json",
        type: "POST"
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function validarEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}