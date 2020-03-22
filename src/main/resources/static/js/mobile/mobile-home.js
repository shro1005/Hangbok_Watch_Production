let playerData = [];
let count = 0;
let my_favorite_count = 0;
let favoriting_me_count = 0;
let my_favorite_players = [];
let favoriting_me_players = [];

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

        drawBanHero();
        drawFavorite();

        const message = $(".message").val();
        // console.log(message);
        if (message == undefined) {

        }else if(message != "") {
            alert(message);
        }
    },
    search : function (userInput) {
        // alert('main search 호출');
        playerData = [];

        let playerName = $('input[id="playerName"]').val();
        const playerName_tap = $('input[id="playerName-tap"]').val();

        if (playerName == "" && playerName_tap == "") {
            playerName = userInput;
        } else if (playerName == "" && playerName_tap != "") {
            playerName = playerName_tap;
        }
        // alert(playerName + " / "+ playerName.indexOf("#"));
        if (playerName.indexOf("#") != -1) {
            playerName = playerName.replace("#", "-");
        }
        if(playerName == "") {

        }else {
            // console.log(playerName);
            location.href = "/search/" + playerName;
        }
    },
    searchReal : function (userInput) {
        $(".player-list-container").empty();
        const noticeDiv = $('<div class="not-fount-base row"><div class="player not-found-player col-md-12">' +
            '검색한 플레이어의 프로필을 조회중입니다.<br>잠시만 기다려 주세요.</div></div>');
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
                        $(".not-fount-base").remove();
                        const noticeDiv = $('<div class="not-fount-base row"><div class="player not-found-player col-md-12"> 옵치하기에 등록된 유저가 아닙니다.<br>' +
                            '옵치하기 최초 검색 시 배틀태그(플레이어명#00000)를 정확하게 입력해야 합니다.</div><div>');
                        //const testDiv = $('<div></div>');
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

const delFavorite = (id, playerName) => {
    console.log("delFavorite 호출");

    var confirmflag = confirm(playerName+ "님을 즐겨찾기에서 삭제하시겠습니까?");
    if(!confirmflag) {return;}

    let input = {
        id: id,
        playerName: 'N'
    };

    $('.cl'+id).remove();

    $.ajax({
        type: 'POST',
        url: '/refreshFavorite',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(input)
    });
};

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

function drawBanHero() {
    // console.log("drawBanHero 호출");
    let items = {
        hero: []
    };

    $.ajax({
        type: 'POST',
        url: '/getBanHero',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async : false
    }).done(function (datas) {
        // console.log(datas);
        if(datas.length != 0) {
            items.hero.push({
                // heroNameTank: datas.heroNameTank,
                // srcTank: "/HWimages/hero/" + datas.heroNameTank + "_s.png",
                // heroNameKRTank: datas.heroNameKRTank,
                // heroNameDeal1: datas.heroNameDeal1,
                // srcDeal1: "/HWimages/hero/" + datas.heroNameDeal1 + "_s.png",
                // heroNameKRDeal1: datas.heroNameKRDeal1,
                // heroNameDeal2: datas.heroNameDeal2,
                // srcDeal2: "/HWimages/hero/" + datas.heroNameDeal2 + "_s.png",
                // heroNameKRDeal2: datas.heroNameKRDeal2,
                // heroNameHeal: datas.heroNameHeal,
                // srcHeal: "/HWimages/hero/" + datas.heroNameHeal + "_s.png",
                // heroNameKRHeal: datas.heroNameKRHeal
                heroNameTank: datas.heroName1,
                srcTank: "/HWimages/hero/" + datas.heroName1 + "_s.png",
                heroNameKRTank: datas.heroNameKR1,
                heroNameDeal1: datas.heroName2,
                srcDeal1: "/HWimages/hero/" + datas.heroName2 + "_s.png",
                heroNameKRDeal1: datas.heroNameKR2,
                heroNameDeal2: datas.heroName3,
                srcDeal2: "/HWimages/hero/" + datas.heroName3 + "_s.png",
                heroNameKRDeal2: datas.heroNameKR3,
                heroNameHeal: datas.heroName4,
                srcHeal: "/HWimages/hero/" + datas.heroName4 + "_s.png",
                heroNameKRHeal: datas.heroNameKR4,
                container1 : datas.heroRole1+"-container",
                container2 : datas.heroRole2+"-container",
                container3 : datas.heroRole3+"-container",
                container4 : datas.heroRole4+"-container",
                src1 : getSrc(datas.heroRole1),
                src2 : getSrc(datas.heroRole2),
                src3 : getSrc(datas.heroRole3),
                src4 : getSrc(datas.heroRole4),
            });
            let ban_list = $("#ban_hero_card").html();
            // console.log(ban_list);
            let template = Handlebars.compile(ban_list);

            const ban_hero_card = template(items);
            $('.ban-hero-list').append(ban_hero_card);
        }
    });
}

const drawFavorite = () => {
    $.ajax({
        type: 'POST',
        url: '/myFavorite/getFavoriteData',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async : false
    }).done(function (datas) {
        const myFavorite = datas.myFavorite;
        const favoritingMe = datas.favoritingMe;

        // console.log(myFavorite);
        // console.log(favoritingMe);
        if(myFavorite != null) {
            // 서버에서 넘어온 myFavortie 리스트가 null이 아닌경우
            my_favorite_count = myFavorite.length;
            if(my_favorite_count != 0) {
                // 서버에서 넘어온 myFavortie 리스트의 길이가 0이 아닌경우
                // console.log("myFavorite is not null / 즐겨찾기한 유저 존재");
                $.each(myFavorite, function (i, player) {
                    my_favorite_players.push(player);
                });
                let my_favorite_list = $("#favorite_list").html();
                // console.log(my_favorite_list);
                let template = Handlebars.compile(my_favorite_list);

                initPlayers(template, 'mb-favorite-player-list-container');
            }else {
                // 서버에서 넘어온 myFavortie 리스트가 길이가 0인 경우
                drawEmpty('mb-favorite-player-list-container');
            }
        }else {
            // 서버에서 넘어온 myFavortie 리스트가 null인 경우
            drawEmpty('mb-favorite-player-list-container');
        }

        // if(favoritingMe != null) {
        //     // 서버에서 넘어온 favoritingMe 리스트가 null이 아닌경우
        //     favoriting_me_count = favoritingMe.length;
        //     if(favoriting_me_count != 0) {
        //         // 서버에서 넘어온 favoritingMe 리스트의 길이가 0이 아닌경우
        //         $.each(favoritingMe, function (i, player) {
        //             favoriting_me_players.push(player);
        //         });
        //         let favoriting_me_list = $("#favorite_player_list").html();
        //         let template = Handlebars.compile(favoriting_me_list);
        //
        //         initPlayers(template, 'player-list-container');
        //     }else {
        //         // 서버에서 넘어온 favoritingMe 리스트가 길이가 0인 경우
        //         drawEmpty('player-list-container');
        //     }
        // }else {
        //     서버에서 넘어온 favoritingMe 리스트가 null인 경우
        //     drawEmpty('player-list-container');
        // }
    });
};

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

function initPlayers(template, target) {
    // console.log("initPlayer 호출 : target => " + target);
    $(".mb-more-btn-div").remove();
    let cnt = 6;
    let item = {
        favorites: []
    };
    if(target === 'mb-favorite-player-list-container') {
        if (my_favorite_players.length < 6) {
            cnt = my_favorite_players.length;
        }

        for (let i = 0; i < my_favorite_count; i++) {
            let data = my_favorite_players[i];
            if (data.battleTag === 'message') {
                alert(data.playerName);
                return false;
            }
            let tag = data.battleTag;
            tag = tag.substr(tag.indexOf("#"));
            if(tag.length === 5) {
                tag = tag.substring(0, 3) + "XX";
            }else if(tag.length === 6) {
                tag = tag.substring(0, 3) + "XXX";
            }else if(tag.length === 7) {
                tag = tag.substring(0, 3) + "XXXX";
            }
            let tankRatingPoint = (data.tankRatingPoint == 0 ? "배치중" : data.tankRatingPoint);
            let dealRatingPoint = (data.dealRatingPoint == 0 ? "배치중" : data.dealRatingPoint);
            let healRatingPoint = (data.healRatingPoint == 0 ? "배치중" : data.healRatingPoint);
            item.favorites.push({
                portrait: data.portrait, tagNum: tag, playerLevel: data.playerLevel, platform: data.platform, playerName: data.playerName, playerId: data.id,
                tankRatingPoint: tankRatingPoint, dealRatingPoint: dealRatingPoint, healRatingPoint: healRatingPoint, isPublic: data.isPublic, forUrl: data.forUrl
            });
        }

        const player_list = template(item);
        $('.'+target).append(player_list);

    }

    // if(my_favorite_count-cnt > 0) {
    //     const moreButtonDiv = $('<div class="mb-more-btn-div" align="center">'
    //         + '<hr><a id="more_btn" href="javascript:morePlayers(\''+target+'\');">더보기(More)</a><hr>'
    //         + '</div>');
    //     $("#"+target+"-more-button").append(moreButtonDiv);
    // }
}

const getSrc = (role) => {
    if(role == "tank") {
        return "/HWimages/role/icon-tank-8a52daaf01.png";
    }else if (role == "deal") {
        return "/HWimages/role/icon-offense-6267addd52.png";
    }else if (role == "heal") {
        return "/HWimages/role/icon-support-46311a4210.png";
    }
};


main.init();
