function initializeBeerDetail(){

	var object = _selectedObject;
	var name = object.get("name");
	var bruery = object.get("bruery");
	var category = object.get("category");
	var alcohol = object.get("alcohol");
	var color = object.get("color");
	var rgb = hslToRGB(color.h, color.s, color.l);

	$("#detailBeerName").text(name);
	$("#detailBruery").text(bruery);
	$("#detailCategory").text(category);
	$("#detailAlcohol").text(alcohol + "%");

    $("#starBeer").raty({
        score: 3,
        number: 5,
        readOnly: true,
        size: 24,
        path: 'images/'
    });

    $("#detailBeerName").css({
    	"border-left": "solid 15px " + rgb,
    	"padding-left": "7px"
    })

    $("#detail_opinion").empty();
    for(var i = 0; i < 10; i++){
        addOpinionList({}, i);
    }
    $("#detail_opinion").listview('refresh');


	$('.beerCanvasChart').canvasChart({
	    polygon : 5,
        valuation : 5,//評価値
        valuationName : ['コク','キレ','苦味','ボディ','香り'],//評価名
        printZero : false,//中央0の表記
        radius : 100,//半径　
        chartStrokeColor : ['#f99E00'],//チャートの線
        chartFillColor : ['rgba(255, 206, 0, 0.5)','none'],//チャートの塗り
        chartPointType : ['arc'],//点の図形タイプ square:四角 or arc:円
		chartPointSize : [3],//チャートの点サイズ
        scale : false//ゲージラインの目盛り描画
	 });

    $('.beerCanvasMiniChart').canvasChart({
        polygon : 5,
        valuation : 5,//評価値
        valuationName : ['コク','キレ','苦味','ボディ','香り'],//評価名
        valuationCntPrint: false,
        printZero : false,//中央0の表記
        radius : 50,//半径　
        chartStrokeColor : ['#f99E00'],//チャートの線
        chartFillColor : ['rgba(255, 206, 0, 0.5)','none'],//チャートの塗り
        chartPointType : ['arc'],//点の図形タイプ square:四角 or arc:円
        chartPointSize : [3],//チャートの点サイズ
        chartPoint : false,//チャートの点描画
        scale : false//ゲージラインの目盛り描画
     });

}


function addOpinionList(obj, index){
    // var user = obj.get("username");
    // var like = Number(obj.get("like"));
    // var koku = obj.get("koku");
    // var kire = obj.get("kire");
    // var bitter = obj.get("bitter");
    // var body = obj.get("body");
    // var smell = obj.get("smell");

    var user = "Daiki Nogami";
    var like = 4;
    var koku = "4";
    var kire = "2";
    var bitter = "1";
    var body = "5";
    var smell = "4";

    var row = $("<li></li>");
    var link = $("<a></a>");
    link.attr("href", "#");

    var el = $("<div></div>").attr("class", "flexbox justify");
    var block = $("<div></div>").attr("class", "block");

    var starBox = $("<div></div>").attr("class", "flexbox box-align");
    starBox.append("<div class='userStarLabel'>好み:</div>");
    starBox.append("<div class='userStarLabel' style='font-weight: bold;''>" + like + "</div>")
    var star = $("<div></div>");
    starBox.append(star);

    block.append("<h1>" + user + "</h1>");
    block.append(starBox);
    el.append(block);

    var chartBox = $("<div></div>").attr("class", "beerCanvasMiniChart");
    var chartInput = $("<div></div>").attr("class", "chartInput");
    chartInput.append("<input type='hidden' value='" + koku + "' name='コク' />");
    chartInput.append("<input type='hidden' value='" + kire + "' name='キレ' />");
    chartInput.append("<input type='hidden' value='" + bitter + "' name='苦味' />");
    chartInput.append("<input type='hidden' value='" + body + "' name='ボディ' />");
    chartInput.append("<input type='hidden' value='" + smell + "' name='香り' />");

    chartBox.append("<canvas width='100' height='110'></canvas>");
    chartBox.append(chartInput);
    el.append(chartBox);

    link.append(el);
    row.append(link);

    $("#detail_opinion").append(row);

    $(star).raty({
        score: like,
        number: 5,
        readOnly: true,
        size: 16,
        path: 'images/',
        starOn: 'star-on-small.png',
        starOff: 'star-off-small.png',
        starHalf: 'star-half-small.png'
    });
}