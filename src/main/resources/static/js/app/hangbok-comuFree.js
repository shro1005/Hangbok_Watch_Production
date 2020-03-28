const free = {
    init : function() {
        $('.navbar-nav .commu-nav').addClass("active");

        const _this = this;
        $('#btn-search-tap').on('click', function (event) {
            _this.search("");

            return false;
        });

        let category = $(".category").val();
        // console.log(category);
        showBoardList(category, 1,"00");

    },
    search : function () {
        // alert('main search 호출');
        let playerName = $('input[id="playerName"]').val();
        if(playerName =="") {return false;}
        else if(playerName.indexOf("#") != -1) {
            // alert("detail playerName # : " + playerName);
            playerName = playerName.replace("#", "-");
        }
        // alert("detail playerName - : " + playerName);
        // console.log("검색한 playerName : " + playerName);
        location.href = "/search/" + playerName;
    }
};

const showBoardList = (target, pageNum, boardTagCd) => {
    $('.active').removeClass('active');
    if(target === "free") {
        $('.total_titular').addClass('active');
        // console.log("total_offset : " +total_offset);
        getBoardTagData("익명게시판");
        getContentData(target, pageNum, boardTagCd);

    }else if(target === "party") {
        $('.tank_titular').addClass('active');
        // console.log("tank_offset : " +tank_offset);
        getBoardTagData("듀오/파티 모집");
        getContentData(target, pageNum, boardTagCd);

    }else if(target === "mypage") {
        $('.deal_titular').addClass('active');
        // console.log("deal_offset : " +deal_offset);

    }
};

const getBoardTagData = (target) => {
    $('.board-tag-buttons').remove();
    const input = {category : target};

    const button_html = $('#board-tag-buttons').html();
    const template = Handlebars.compile(button_html);

    const items = {
        buttons : []
    };

    $.ajax({
        type: 'POST',
        url: '/community/getBoardTag',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(input),
        async : false
    }).done(function (datas) {
        items.buttons.push({boardTagCd : "00", boardTagVal : "전체보기", clicked: "clicked"});
        $.each(datas, function (i, data) {
            if(data.boardTagCd === "01") {}
            else {
                items.buttons.push({boardTagCd: data.boardTagCd, boardTagVal: data.boardTagVal, clicked: ""});
            }
        });
        items.buttons.push({boardTagCd : "99", boardTagVal : "10추글", clicked: ""});
    });

    const inputItem = template(items);
    $(".community-container").append(inputItem);

};

const getContentData = (target, pageNum, boardTagCd) => {
    const input = {target: target, pageNum: pageNum, boardTagCd: boardTagCd};

    $.ajax({type: 'POST',
        url: '/community/getContentData',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(input),
        async : false
    }).done(function (datas) {
        // console.log(datas);

        $.each(datas, function (i, data) {

        });
    });
};

free.init();