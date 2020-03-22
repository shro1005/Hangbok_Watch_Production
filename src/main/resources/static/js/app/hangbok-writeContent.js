let markup = null;
$('.navbar-nav .commu-nav').addClass("active");

$(document).ready(function() {
    $('#summernote').summernote({
        lang: 'ko-KR', // default: 'en-US',
        placeholder: '상대방을 모욕하는 글,' +
            '\n다른 사람들에게 혐오감을 주는 글은 삭제 될 수 있습니다.',
        tabsize: 2,
        height: 500,
        codemirror: { // codemirror options
            theme: 'monokai'
        },
        callbacks: {
            onImageUpload: function(files) {
                for(let i = 0; i < files.length; i++)
                {
                    SubirImagen(files[i]);
                }
            }
        }
    });
});

function SubirImagen(file)
{
    if(file.type.includes('image'))
    {
        let name = file.name.split(".");
        name = name[0];
        let data = new FormData();
        data.append('file', file);
        $.ajax({
            contentType: false,
            cache: false,
            processData: false,
            type: 'POST',
            url: '/community/saveImage',
            dataType: 'json',
            data: data,
            async : false
        }).done(function (response) {
            if(response.isOk ==="ok")
            {
                $('#summernote').summernote('insertImage', response.url, name);
            }
            else
            {
                console.log(response.error);
                if(response.error ==="nonError") {
                    $('#summernote').summernote('insertImage', response.url, name);
                }
            }
        });
    }
    else
    {
        console.log("El tipo de archivo que intentaste subir no es una imagen");
    }
}

// const showPreview = () => {
//
//     if($('.preview').hasClass('re-write') === true) {
//         $('#summernote').summernote({focus: true});
//         $('.preview').removeClass('re-write');
//         $('.preview').children().text("미리보기");
//         markup = null;
//     }else {
//         markup = $('#summernote').summernote('code');
//         console.log(markup);
//         $('#summernote').summernote('destroy');
//         $('.preview').addClass('re-write');
//         $('.preview').children().text("수정하기");
//     }
//
// };

const saveContent = () => {
    if($(".content-title").val()=="" || $(".content-title").val()==null) {
        alert("제목이 비어있습니다. 제목을 작성해주세요.");
        $(".content-title").focus();
        return;
    }

    if ($('#summernote').summernote('isEmpty')) {
        let conFlag = confirm('작성한 내용이 없습니다.\n 그래도 저장하시겠습니까?');

        if(conFlag) {
            if(markup == null) {
                markup = $('#summernote').summernote('code');
            }
            $("#content-form").submit();
        }
    }else {
        let saveFlag = confirm("작성한 내용을 저장하시겠습니까?");

        if(saveFlag) {
            if(markup == null) {
                markup = $('#summernote').summernote('code');
            }
            $("#content-form").submit();
        }
    }

    let category = $("#category").val();
    if (category === "익명게시판") {
        category = "free";
    }else if (category === "듀오/티 모집") {
        category = "party";
    }

    location.href = "/community?category=" +category;
};
