const total_ranker_list = [];
const tank_ranker_list = [];
const deal_ranker_list = [];
const heal_ranker_list = [];
let total_offset = 0;
let tank_offset = 0;
let deal_offset = 0;
let heal_offset = 0;
const limit = 25;

$(window).resize(function () {
    // 창크기 변화 감지
    setContainerHeight();
});

const main = {
    init: function () {
        // console.log("main.init 호출");
        const _this = this;
        $('#btn-search').on('click', function (event) {
            _this.search();
            return false;
        });

        // 엔터키 눌렀을 때 search 메소드 호
        $(document).keypress(function (e) {
            if (e.which == 13) {
                // alert('enter key is pressed');
                _this.search("");

                return false;
            }
        });

        getRankingData();
        setContainerHeight();
        showRankerList("total");

        $('.mobile-footer-container .mf-search').removeClass("mb-active");
        $('.mobile-footer-container .mf-ranking').addClass("mb-active");
        $('.mobile-footer-container .mf-ranker').removeClass("mb-active");
        $('.mobile-footer-container .mf-ranking').html("<img class=\"footer-img\" src=\"/HWimages/util/ranking-active.png\"><br>금주랭킹");
    },
    search: function () {
        // alert('main search 호출');
        let playerName = $('input[id="playerName"]').val();
        if (playerName == "") {
            return false;
        } else if (playerName.indexOf("#") != -1) {
            // alert("detail playerName # : " + playerName);
            playerName = playerName.replace("#", "-");
        }
        // alert("detail playerName - : " + playerName);
        // console.log("검색한 playerName : " + playerName);
        location.href = "/search/" + playerName;
    }
};

const getRankingData = () => {
    // console.log("getRankingData 호출");

    // 표시할 랭킹 목록 생성
    let ranking_list = $("#our-ranking-list").html();
    let ranking_list_template = Handlebars.compile(ranking_list);

    let list = {
        list:[{className : "tank-rating-ranking", title : "금주의 상한가(돌격)"},
            {className : "deal-rating-ranking", title : "금주의 상한가(공격)"},
            {className : "heal-rating-ranking", title : "금주의 상한가(지원)"},
            {className : "playtime-ranking", title : "금주의 오버워치 덕후"},
            {className : "spendonfire-ranking", title : "금주의 폭주왕"},
            {className : "envkill-ranking", title : "금주의 낙사왕"}]
    };

    const item = ranking_list_template(list);
    $('.mb-ranking-container').append(item);

    // 랭킹 목록에 들어갈 각 내용들 조회
    $.ajax({
        type: 'POST',
        url: '/ranking/getRankingData',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async : false
    }).done(function (datas) {
        $.each(datas, function (j, data) {

            let ranking_contents = $("#our-ranking-contents").html();
            let ranking_cpontents_template = Handlebars.compile(ranking_contents);

            let ranking = {
                ranking:[]
            };
            let className = "";
            $.each(data, function (i, val) {
                // console.log("test33333333333");
                // console.log(val);
                let forUrl = val.battleTag.replace("#", '-');
                ranking.ranking.push({ranking : "mb-ranking-" + (i+1), rankingImgPath : "/HWimages/ranking/icon-"+(i+1)+"-ranking.png", playerPortrait : val.portrait, playerName: val.playerName, score : val.score, forUrl: forUrl})
                className = val.className;
            });
            const item = ranking_cpontents_template(ranking);
            $('.'+className).append(item);
        });
    });
};

function playerDetail(obj) {
    // console.log($(obj).attr('attr-p'), $(obj).attr('attr-u'));

    const forUrl = $(obj).attr('attr-u');
    location.href = "/showPlayerDetail/"+forUrl;
}

main.init();