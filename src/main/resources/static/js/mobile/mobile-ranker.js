const total_ranker_list = [];
const tank_ranker_list = [];
const deal_ranker_list = [];
const heal_ranker_list = [];
let total_offset = 0;
let tank_offset = 0;
let deal_offset = 0;
let heal_offset = 0;
const limit = 25;

// $(function(){
//     stickySelector();
//
//     $(window).scroll(stickySelector).resize(stickySelector);
// });
//
// function stickySelector(){
//     let document_height = $(document).height(); // 문서 전체 높이
//     let document_scrollTop = $(document).scrollTop(); // 문서 전체 높이 중 스크롤 위치
//     let window_height = $(window).height(); // 창 높이
//     let footer_height = $(".mb-ranking-tab").height();
//
//     // gap = document_height - footer_height - window_height;
//     // bottom = document_scrollTop - gap ;
//
//     $(".mb-ranking-tab").css("top",$(document).scrollTop() + 100 + "px");
//
//     // if(document_scrollTop > gap && gap >= 0){
//     //     $("footer").css("bottom", bottom+"px");
//     // }else{
//     //     $("footer").css("bottom","0");
//     // }
// }

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

        showRankerList("total");

        $('.mobile-footer-container .mf-search').removeClass("mb-active");
        $('.mobile-footer-container .mf-ranking').removeClass("mb-active");
        $('.mobile-footer-container .mf-ranker').addClass("mb-active");
        $('.mobile-footer-container .mf-ranker').html("<img class=\"footer-img\" src=\"/HWimages/util/ranker-active.png\"><br>랭커보기");
    }
};

const getRankerData = (target, offset, limit) => {
    const input = {target : target, offset : offset, limit : limit};

    // 랭커 목록에 들어갈 각 내용들 조회
    $.ajax({type: 'POST',
        url: '/ranking/getRankerData',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(input),
        async : false
    }).done(function (datas) {
        // console.log(datas);
        $.each(datas, function (i, data) {
            if(target == "total") {
                total_ranker_list.push(data);
            }else if(target == "tank") {
                tank_ranker_list.push(data);
            }else if(target == "deal") {
                deal_ranker_list.push(data);
            }else if(target == "heal") {
                heal_ranker_list.push(data);
            }
        });
    });
};

function drawList(i, data) {
    // console.log(data);
    // console.log(data.portrait, data.battleTag, data.playerLevel, data.mostHero1, data.mostHero3, data.tankRatingPoint);
    return {portrait: data.portrait, battleTag: data.battleTag, playerLevel: data.playerLevel, platform: data.platform, tankRatingPoint: data.tankRatingPoint, dealRatingPoint: data.dealRatingPoint, healRatingPoint: data.healRatingPoint, winRate: data.winRate,
        mostHero1: "/HWimages/hero/"+data.mostHero1+"_s.png", mostHero2: "/HWimages/hero/"+data.mostHero2+"_s.png", mostHero3: "/HWimages/hero/"+data.mostHero3+"_s.png", isPublic: data.isPublic, forUrl: data.forUrl, tankRatingImg: data.tankRatingImg,
        dealRatingImg: data.dealRatingImg, healRatingImg: data.healRatingImg, wingame: data.winGame, losegame: data.loseGame, udtDtm: data.udtDtm, ranking : (i+1)};
}

const drawMoreButton = (target) => {
    if(target == "total") {
        if (total_offset < 75) {
            const moreButtonDiv = $('<div class="mb-more-btn-div" align="center">'
                + '<a href="javascript:morePlayers(\''+target+'\');"><div class="mb-more-btn"><p>더보기(More)</p></div></a>'
                + '</div>');
            $(".mb-more-button").append(moreButtonDiv);
        }

    }else if(target == "tank") {
        if (tank_offset < 75) {
            const moreButtonDiv = $('<div class="mb-more-btn-div" align="center">'
                + '<a href="javascript:morePlayers(\''+target+'\');"><div class="mb-more-btn"><p>더보기(More)</p></div></a>'
                + '</div>');
            $(".mb-more-button").append(moreButtonDiv);
        }

    }else if(target == "deal") {
        if (deal_offset < 75) {
            const moreButtonDiv = $('<div class="mb-more-btn-div" align="center">'
                + '<a href="javascript:morePlayers(\''+target+'\');"><div class="mb-more-btn"><p>더보기(More)</p></div></a>'
                + '</div>');
            $(".mb-more-button").append(moreButtonDiv);
        }
    }else if(target == "heal") {
        if (heal_offset < 75) {
            const moreButtonDiv = $('<div class="mb-more-btn-div" align="center">'
                + '<a href="javascript:morePlayers(\''+target+'\');"><div class="mb-more-btn"><p>더보기(More)</p></div></a>'
                + '</div>');
            $(".mb-more-button").append(moreButtonDiv);
        }
    }
};

const drawRankerList = (target) => {
    $(".player-list-container").empty();
    $(".mb-more-button").empty();
    const item = {
        players: []
    };

    if(target == "total") {
        $.each(total_ranker_list, function (i, data) {
            const player = drawList(i, data);
            item.players.push(player);
        });

    }else if(target == "tank") {
        // console.log(tank_ranker_list);
        $.each(tank_ranker_list, function (i, data) {
            const player = drawList(i, data);
            item.players.push(player);
        });

    }else if(target == "deal") {
        // console.log(deal_ranker_list);
        $.each(deal_ranker_list, function (i, data) {
            const player = drawList(i, data);
            item.players.push(player);
        });

    }else if(target == "heal") {
        // console.log(heal_ranker_list);
        $.each(heal_ranker_list, function (i, data) {
            const player = drawList(i, data);
            item.players.push(player);
        });

    }
    const ranker_list = $("#ranking_player_list").html();
    // console.log(ranker_list);
    const template = Handlebars.compile(ranker_list);
    const player_list = template(item);
    $(".player-list-container").append(player_list);

    drawMoreButton(target);
};

const showRankerList = (target) => {
    $('.active').removeClass('active');
    if(target == "total") {
        $('.total_titular').addClass('active');
        // console.log("total_offset : " +total_offset);
        if (total_offset == 0) {
            getRankerData(target, total_offset, limit);
            drawRankerList(target);
            total_offset += limit;
        }else {
            drawRankerList(target);
        }
    }else if(target == "tank") {
        $('.tank_titular').addClass('active');
        // console.log("tank_offset : " +tank_offset);
        if (tank_offset == 0) {
            getRankerData(target, tank_offset, limit);
            drawRankerList(target);
            tank_offset += limit;
        }else {
            drawRankerList(target);
        }
    }else if(target == "deal") {
        $('.deal_titular').addClass('active');
        // console.log("deal_offset : " +deal_offset);
        if (deal_offset == 0) {
            getRankerData(target, deal_offset, limit);
            drawRankerList(target);
            deal_offset += limit;
        }else {
            drawRankerList(target);
        }
    }else if(target == "heal") {
        $('.heal_titular').addClass('active');
        // console.log("heal_offset : " +heal_offset);
        if (heal_offset == 0) {
            getRankerData(target, heal_offset, limit);
            drawRankerList(target);
            heal_offset += limit;
        }else {
            drawRankerList(target);
        }
    }
};

const drawMoreRankerList = (target, offset) => {
    const item = {
        players: []
    };

    if(target == "total") {
        $.each(total_ranker_list, function (i, data) {
            if (i >= offset) {
                const player = drawList(i, data);
                item.players.push(player);
            }
        });

    }else if(target == "tank") {
        $.each(tank_ranker_list, function (i, data) {
            if (i >= offset) {
                const player = drawList(i, data);
                item.players.push(player);
            }
        });

    }else if(target == "deal") {
        $.each(deal_ranker_list, function (i, data) {
            if (i >= offset) {
                const player = drawList(i, data);
                item.players.push(player);
            }
        });

    }else if(target == "heal") {
        $.each(heal_ranker_list, function (i, data) {
            if (i >= offset) {
                const player = drawList(i, data);
                item.players.push(player);
            }
        });

    }
    const ranker_list = $("#more_player_list").html();
    const template = Handlebars.compile(ranker_list);
    const player_list = template(item);
    $('.tbody:last').append(player_list);

    drawMoreButton(target);
};

const morePlayers = (target) => {
    $(".mb-more-btn-div").remove();
    if(target == "total") {
        getRankerData(target, total_offset, limit);
        drawMoreRankerList(target, total_offset);
        total_offset += limit;

    }else if(target == "tank") {
        getRankerData(target, tank_offset, limit);
        drawMoreRankerList(target, tank_offset);
        tank_offset += limit;

    }else if(target == "deal") {
        getRankerData(target, deal_offset, limit);
        drawMoreRankerList(target, deal_offset);
        deal_offset += limit;

    }else if(target == "heal") {
        getRankerData(target, heal_offset, limit);
        drawMoreRankerList(target, heal_offset);
        heal_offset += limit;
    }
};

function playerDetail(obj) {
    // console.log($(obj).attr('attr-p'), $(obj).attr('attr-u'));

    const forUrl = $(obj).attr('attr-u');
    location.href = "/showPlayerDetail/"+forUrl;
}

main.init();