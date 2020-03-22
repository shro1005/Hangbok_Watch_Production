let playerData = [];
let count = 0;

const main = {
    init : function(){
        // alert('main init 호출');
        $(window).on('load', function () {
            const flag = $('.fromDetail').attr("id");
            const userInput = $('.fromDetail').attr("value");;
            // console.log("flag : " + flag + " , userInput : " + userInput);
            if(flag=='Y') {
                _this.searchReal(userInput);

                event.preventDefault();

            }
        });

        const _this = this;
        $('#btn-search').on('click', function (event) {
            _this.search("");

            event.preventDefault();

            return false;
        });

        // 엔터키 눌렀을 때 search 메소드 호
        $(document).keypress(function (e) {
            if (e.which == 13) {
                // alert('enter key is pressed');
                _this.search("");

                e.preventDefault();

                return false;
            }
        });

        $('.mobile-footer-container .mf-search').addClass("mb-active");
        $('.mobile-footer-container .mf-ranking').removeClass("mb-active");
        $('.mobile-footer-container .mf-ranker').removeClass("mb-active");
        $('.mobile-footer-container .mf-search').html("<img class=\"footer-img\" src=\"/HWimages/util/search-active.png\"><br>검색");

    },
    search : function (userInput) {
        // alert('main search 호출');
        playerData = [];

        let playerName = $('input[id="playerName"]').val();

        if (playerName == "") {
            playerName = userInput;
        }
        // alert(playerName + " / "+ playerName.indexOf("#"));
        if (playerName.indexOf("-") != -1) {
            playerName = playerName.replace("-", "#");
        }
        if(playerName == "") {

        }else {
            // console.log(playerName);
            // location.href = "/search/" + playerName;
            this.searchReal(playerName);
        }
    },
    searchReal : function (userInput) {
        $(".player-list-container").empty();
        const noticeDiv = $('<div class="col-md-12 mb-not-fount-base">' +
            '검색한 플레이어의 프로필을 조회중입니다.<br>잠시만 기다려 주세요.</div>');
        $(".player-list-container").append(noticeDiv);
        playerName = userInput;

        const inputName = {
            playerName: playerName
        };
        // console.log("playerName : " + playerName);
        $.ajax({
            type: 'POST',
            url: '/showPlayerList',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(inputName),
            async : false
        }).done(function (datas) {
            // console.log("showPlayerList => " + datas);
            // console.log("/showPlayerList => 결과 내역 사이즈 : " + datas.length);
            count = datas.length;
            if(datas.length != 0) {
                $.each(datas, function (idx, data) {
                    playerData.push(data);
                });
                let player_list = $("#player_list").html();
                let template = Handlebars.compile(player_list);

                initPlayers(template);
            }else {
                $.ajax({
                    type: 'POST',
                    url: '/crawlingPlayerList',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(inputName),
                    async : false
                }).done(function (crawlingResult) {
                    // console.log("showUserList => " + crawlingResult);
                    // console.log("/showUserList => 결과 내역 사이즈 : " + crawlingResult.length);
                    if(crawlingResult.length == 0) {
                        $(".mb-not-fount-base").remove();
                        const noticeDiv = $('<div class="mb-not-fount-base">' +
                            '행복워치 최초 검색 시 배틀태그(플레이어명#00000)를 정확하게 입력해야 합니다.</div>');
                        $(".player-list-container").append(noticeDiv);
                    }else {
                        $.each(crawlingResult, function(i, player){
                            // console.log(player.battleTag, player.playerName);
                            location.href = "/showPlayerDetail/" + player.forUrl;
                        });
                    }
                });
            }
        });

        $('input[id="playerName"]').val("");
    }
};

function initPlayers(template) {
    $(".mb-not-fount-base").remove();
    $(".mb-more-btn-div").remove();
    var cnt = 12;
    if (playerData.length < 12) {
        cnt = playerData.length;
    }

    let item = {
        players: []
    };
    for (var i = 0 ; i < cnt ; i++) {
        var data = playerData[i];
        if(data.battleTag === 'message') {
            alert(data.playerName);
            return false;
        }
        const player = drawList(data);
        item.players.push(player);
    }

    const player_list = template(item);
    $('.player-list-container').append(player_list);

    if(playerData.length - cnt > 0) {
        const moreButtonDiv = $('<div class="mb-more-btn-div" align="center">'
            + '<a href="javascript:morePlayers();"><div class="mb-more-btn"><p>더보기(More)</p></div></a>'
            + '</div>');
        $(".mb-more-button").append(moreButtonDiv);
    }
    playerData.splice(0,cnt);
}

function morePlayers() {
    $(".mb-more-btn-div").remove();
    let cnt = 12;
    if (playerData.length < 12) {
        cnt = playerData.length;
    }

    let item = {
        players: []
    };
    for (let i = 0 ; i < cnt ; i++) {
        let data = playerData[i];
        if(data.battleTag === 'message') {
            alert(data.playerName);
            return false;
        }
        const player = drawList(data);
        item.players.push(player);
    }

    let more_player_list = $("#more_player_list").html();
    let template = Handlebars.compile(more_player_list);
    const player_list = template(item);
    $('.tbody:last').append(player_list);

    if(playerData.length - cnt > 0) {
        // alert(playerData.length, cnt);
        const moreButtonDiv = $('<div class="mb-more-btn-div" align="center">'
            + '<a href="javascript:morePlayers();"><div class="mb-more-btn"><p>더보기(More)</p></div></a>'
            + '</div>');
        $(".mb-more-button").append(moreButtonDiv);
    }
    playerData.splice(0,cnt);
}

function playerDetail(obj) {
    // console.log($(obj).attr('attr-p'), $(obj).attr('attr-u'));
    const isPublic = $(obj).attr('attr-p');
    const forUrl = $(obj).attr('attr-u');
    location.href = "/showPlayerDetail/"+forUrl;
    // if(isPublic == 'Y') {
    //     location.href = "/showPlayerDetail/"+forUrl;
    // } else {
    //     alert("플레이어가 프로필을 비공개했습니다.\n" +
    //         "인게임에서 프로필 공개 이후 다시 검색해주세요.");
    //     return;
    // }
}

function drawList(data) {
    // return new Promise(function(data){})
    if(data.battleTag === 'message') {
        alert(data.playerName);
        return false;
    }
    let tag = data.battleTag.substring(data.battleTag.indexOf("#"));
    if(tag.length === 5) {
        tag = tag.substring(0, 3) + "XX";
    }else if(tag.length === 6) {
        tag = tag.substring(0, 3) + "XXX";
    }else if(tag.length === 7) {
        tag = tag.substring(0, 3) + "XXXX";
    }
    // console.log(data.udtDtm);
    return {portrait: data.portrait, battleTag: data.battleTag, playerLevel: data.playerLevel, platform: data.platform, tankRatingPoint: data.tankRatingPoint, dealRatingPoint: data.dealRatingPoint, healRatingPoint: data.healRatingPoint, winRate: data.winRate,
        mostHero1: "/HWimages/hero/"+data.mostHero1+"_s.png", mostHero2: "/HWimages/hero/"+data.mostHero2+"_s.png", mostHero3: "/HWimages/hero/"+data.mostHero3+"_s.png", isPublic: data.isPublic, forUrl: data.forUrl, tankRatingImg: data.tankRatingImg,
        dealRatingImg: data.dealRatingImg, healRatingImg: data.healRatingImg, wingame: data.winGame, losegame: data.loseGame, udtDtm: data.udtDtm, playerName: data.playerName, tag: tag};
}

function drawEmpty(target) {
    let empty_favorite_list = $("#empty_favorite_list").html();
    // console.log(my_favorite_list);
    let template = Handlebars.compile(empty_favorite_list);

    let item = {
        favorites: [{empty: "empty"}]
    };

    const player_list = template(item);
    $('.'+target).append(player_list);

}

main.init();
