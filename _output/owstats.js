$(function () {
    init();
})


const HERO_GOOD_COUNTERS = "counter-good";
const HERO_BAD_COUNTERS = "counter-bad";
const herosData = window.OW_DATA;
const charList = getCharList_data(herosData);
let activeContainer,
    inactiveContainer,
    activeContainer_num,
    inactiveContainer_num;

init = () => {
    const charMarkup = getCharNavList_markup(charList);

    $(".chars-list #tank .list").prepend(charMarkup["tank"]);
    $(".chars-list #attack .list").prepend(charMarkup["attack"]);
    $(".chars-list #heal .list").prepend(charMarkup["heal"]);

    $(".hero-list-item").click(heroNavIconClicked);
    $(".counter-container").click(heroDisplayContainerClicked);

    activeContainer = $('.container-1');
    activeContainer_num = 1;
}

function heroDisplayContainerClicked(e) {
    const clickedContainer = $(e.currentTarget);
    $(".counter-containers .selected").removeClass("msg_not-selected msg_selected");
    $(".counter-containers .selected").addClass("msg_not-selected");
    clickedContainer.find(".selected").removeClass("msg_not-selected").addClass("msg_selected");

    activeContainer_num = e.currentTarget.className.includes("1") ? 1 : 2;
    inactiveContainer_num = activeContainer_num == 1 ? 2 : 1;
    activeContainer = $(`.container-${activeContainer_num}`);
    inactiveContainer = $(`.container-${inactiveContainer_num}`);
}

function heroNavIconClicked(e) {
    const heroIconEl = $(e.currentTarget);
    const heroName = heroIconEl.attr("id").split("hero_")[1];
    const heroImgSrc = `_output/hero-icons/${
        charList[heroName]
    }.png`;
    const heroGoodCounters_data = getHeroCounters_data(heroName, herosData, HERO_GOOD_COUNTERS)
    const heroBadCounters_data = getHeroCounters_data(heroName, herosData, HERO_BAD_COUNTERS)

    const heroGoodCounters_markup = getHeroCountersList_markup(heroGoodCounters_data, "good");
    const heroBadCounters_markup = getHeroCountersList_markup(heroBadCounters_data, "bad");

    heroIconEl.addClass(`hero-${activeContainer_num}-active`);

    activeContainer.find('.hidden').removeClass("hidden");
    activeContainer.find('.counters-good .content').html(heroGoodCounters_markup);
    activeContainer.find('.counters-bad .content').html(heroBadCounters_markup);
    activeContainer.find('.selectedHeroImage').attr("src", heroImgSrc);
    activeContainer.find('.selectedHeroName').html(heroName);

    $(".hero-list-item").removeClass(`hero-${activeContainer_num}-active`);
}

function getCharList_data(_data) {
    return Object.keys(_data[0]).reduce(function (acc, key, index) {
        if (herosData[0][key] != "counter-header") {
            const heroSearchName = key.toLowerCase().trim().replace(".", "").replace(": ", "")
            acc[key] = heroSearchName
            // {D.VA:dva} 
        }
        return acc;
    }, {})
}

function getCharNavList_markup(_data) { /*
    RETURN DATA:
        {
            attack:html,
            heal:html,
            tank:html
        }   
    */
    let charPositions = {
        attack: [
            "ashe",
            "bastion",
            "doomfist",
            "genji",
            "hanzo",
            "junkrat",
            "mccree",
            "mei",
            "pharah",
            "soldier76",
            "sombra",
            "symmetra",
            "torbjorn",
            "tracer",
            "widowmaker",
            "reaper"
        ],
        heal: [
            "ana",
            "baptiste",
            "brigitte",
            "lucio",
            "mercy",
            "moira",
            "zenyatta"
        ],
        tank: [
            "dva",
            "orisa",
            "reinhardt",
            "roadhog",
            "sigma",
            "winston",
            "wreckingball",
            "zarya"
        ]
    };
    const charMap = swapKeysWithValues(charList);

    return Object.keys(charPositions).reduce((acc, key, index) => {
        let sectionListData = "";
        charPositions[key].forEach((_heroSafeName) => {
            console.log(key, _heroSafeName, charMap[_heroSafeName])

            const heroIconSrc = `_output/hero-icons/${_heroSafeName}.png`;
            sectionListData += `<div id="hero_${
                charMap[_heroSafeName]
            }" class="hero-list-item"><div class="img-container"><img width="100%" src="${heroIconSrc}"/></div><p>${
                charMap[_heroSafeName]
            }</p></div>`;
        })
        acc[key] = sectionListData;
        return acc;
    }, {})
}

function getHeroCounters_data(_hero, _herosData, _counterType) {
    let counters;
    let heroObject = getHero_data(_hero, _herosData);
    counters = Object.keys(heroObject).reduce((acc, key, index) => {
        let heroProps = heroObject[key];

        if (heroProps.includes(_counterType)) {
            heroProps = heroProps.replace(_counterType, "").trim();
            acc[key] = heroProps;
        }
        return acc;
    }, {})
    return counters;
}

function getHero_data(_hero, _data) {
    return Object.keys(_data).reduce((acc, _possibleHero, index) => {
        const possibleHeroObject = _data[_possibleHero];
        if (possibleHeroObject[_hero] == "same-hero") {
            acc = possibleHeroObject;
        }
        return acc;
    }, {})
}

function getHeroCountersList_markup(_data, _type) {
    let markupListHeader = `<ul class="hero-counters-${_type}">`;
    let markupList = Object.keys(_data).reduce((acc, _hero, index) => {
        let quality = _data[_hero];
        const heroIcon = `_output/hero-icons/${
            charList[_hero]
        }.png`;

        acc += `<li id="hero-counter-${_hero}" class="hero-counter-item ${quality}"><img class="heroIcon" height="100%" src="${heroIcon}"/>${_hero}</li>`;
        return acc;
    }, markupListHeader);

    markupList += "</ul>"
    return markupList;
}

function swapKeysWithValues(_obj) {
    var ret = {};
    for (var key in _obj) {
        ret[_obj[key]] = key;
    }
    return ret;
}
