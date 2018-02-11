/**
* Class for a simple stopwatch
* source: https://codepen.io/_Billy_Brown/pen/dbJeh
*/
class Stopwatch {
   constructor(display, results) {
       this.running = false;
       this.display = display;
       this.results = results;
       this.laps = [];
       this.reset();
       this.print(this.times);
   }

   reset() {
       this.times = [ 0, 0, 0 ];
   }

   start() {
       if (!this.time) this.time = performance.now();
       if (!this.running) {
           this.running = true;
           requestAnimationFrame(this.step.bind(this));
       }
   }

   lap() {
       let times = this.times;
       let li = document.createElement('li');
       li.innerText = this.format(times);
       this.results.appendChild(li);
   }

   stop() {
       this.running = false;
       this.time = null;
   }

   restart() {
       if (!this.time) this.time = performance.now();
       if (!this.running) {
           this.running = true;
           requestAnimationFrame(this.step.bind(this));
       }
       this.reset();
   }

   clear() {
       clearChildren(this.results);
   }

   step(timestamp) {
       if (!this.running) return;
       this.calculate(timestamp);
       this.time = timestamp;
       this.print();
       requestAnimationFrame(this.step.bind(this));
   }

   calculate(timestamp) {
       var diff = timestamp - this.time;
       // Hundredths of a second are 100 ms
       this.times[2] += diff / 10;
       // Seconds are 100 hundredths of a second
       if (this.times[2] >= 100) {
           this.times[1] += 1;
           this.times[2] -= 100;
       }
       // Minutes are 60 seconds
       if (this.times[1] >= 60) {
           this.times[0] += 1;
           this.times[1] -= 60;
       }
   }

   print() {
       this.display.innerText = this.format(this.times);
   }

   format(times) {
       return `\
${pad0(times[0], 2)}:\
${pad0(times[1], 2)}`;
   }
}

function pad0(value, count) {
   var result = value.toString();
   for (; result.length < count; --count)
       result = '0' + result;
   return result;
}

function clearChildren(node) {
   while (node.lastChild)
       node.removeChild(node.lastChild);
}

let stopwatch = new Stopwatch(
   document.querySelector('.stopwatch'),
   document.querySelector('.results'));


/**
* @description shuffle function from http://stackoverflow.com/a/2450976
* @param {array} array
* @returns {array} the input array in a random order
*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
*  a list that holds all of your cards
* declare initial variables for moves, stars, and solved cards
*/
var cards = ["gem", "paper-plane", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb",
              "gem", "paper-plane", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"]
var moves = 0;
var stars = 3;
var solved_cards = 0;

/**
* @description display the cards on the page
* @param {none} none
* @returns {string} html code with shuffled cards
*/
function showCards() {
  cards = shuffle(cards); // shuffle the initial array of cards
  $('.deck').empty();
  cards.forEach(function(card) {
    var html = '<li class="card"><i class="fas fa-'+card+'"></i></li>'; // create html for each card
    $('.deck').append(html);
  });
}

/**
* @description set event listener and compare the two last cards clicked
* @param {none} none
* @returns solved cards if two cards match, turn cards if they don't match, end game if all cards are solved
*/
function compareTwoLastCards() {
  var previousCard = ''; // reset variable for previous card
  $('.card').click(clickCards);

  function clickCards() {
    $(this).addClass('open show');
    $(this).off();
    //console.log("card has been clicked"); //debugging line
    if (previousCard == '') {
      previousCard = $(this).children().attr('class');
      $(this).children().attr('id', 'first');
      cardAnimation(this); // animate the clicked card
    } else {
      if (previousCard == $(this).children().attr('class')) {
        //console.log(prev); // debugging line
        $(this).addClass('solved');
        $('#first, #second').parent().addClass('solved');
        $('#first, #second').removeAttr('id');
        $('.solved').off() // disable event listener for solved cards
        counter(); // count moves up
      } else {
        // console.log("cards are not equal"); // debugging line
        $(this).children().attr('id', 'second');
        errorAnimation(this); // animate clicked card with error animation
        errorAnimation('#first'); // animate previously clicked card with error animation
        $('#first, #second').parent().addClass('wrong');
        counter(); // count moves up
        setTimeout(function() {
          $('#first, #second').parent().removeClass('open show wrong');
          $('#first, #second').parent().click(clickCards);
          $('#first, #second').removeAttr('id');
        }, 1500);
      }
      previousCard = '';
    }

    if ($('.solved').length == cards.length) {
      setTimeout(function() {
        endGame(); // end game if all cards are solved
      }, 1000)
    }
  }
}

// function for the counter
/**
* @description count the number of moves and display stars accordingly
* @param {none} none
* @returns moves count & stars display
*/
function counter() {
  moves += 1;
  $('.moves').text(moves);
  if (moves > 20) {
    $('.stars').children('li:nth-child(3)').children().removeClass('fas fa-star').addClass('far fa-star');
    stars = 2;
  } if (moves > 25) {
    $('.stars').children('li:nth-child(2)').children().removeClass('fas fa-star').addClass('far fa-star');
    stars = 1;
  }
}

/**
* @description animation for cards which are turned
* @param {none} none
* @returns change css style for turned card temporarily (100ms)
*/
function cardAnimation(card) {
  $(card).css('transform', 'rotateY(20deg)');
  $(card).animate({
    width: '+=10px'
  }, 100);
  $(card).animate({
    width: '-=10px'
  });
}

/**
* @description animation for cards which do not match
* @param {string} string for a card
* @returns hange css style for turned card temporarily (100ms)
*/
function errorAnimation(card) {
  $(card).animate({
    'margin-left': '-=10px',
    'margin-right': '+=10px',
    'margin-top': '+=10px'
  }, 100);
  $(card).animate({
    'margin-left': '+=10px',
    'margin-right': '-=10px',
    'margin-top': '-=10px'
  }, 100);
}

// restart button launches the game
/**
* @description restart the game after click on restart button
* @param {none} none
* @returns reset moves and stars, display shuffled cards, reset stopwatch
*/
function restart() {
  $('#restart-icon, #restart-button').click(function() {
    moves = 0;
    $('.game-over').css('display', 'none');
    $('.deck, .card').css('display', 'flex');
    $('.score-panel').css('display', 'inline-block');
    $('.moves').text(moves);
    $('.stars').children('li').children().removeClass('far fa-star').addClass('fas fa-star');
    showCards();
    compareTwoLastCards();
    stopwatch.restart();
  });
}

/**
* @description end the game after winning
* @param {none} none
* @returns hide all cards, display panel with congratulation message, time, moves, stars, and restart button
*/
function endGame() {
  $('.score-panel, .card').css('display', 'none');
  $('.deck').css('display', 'none');
  $('.game-over').css('display', 'block');
  $('.game-over').prepend("<div class='fa-4x' style='color:#66ff99'><i class='far fa-check-circle'></div>");
  $('#endGameText').html("With "+moves+" Moves and "+stars+" Stars.<br>Well done!<br><br>Total time:");
  stopwatch.lap();
  restart();
}

/**
* @description run the actual game
* @param {none} none
* @returns calling several functions for playing the game
*/
function playGame() {
  stopwatch.restart(); //start the stopwatch at 0:00
  showCards(); // shuffle and display the deck of cards
  compareTwoLastCards(); // compare the two last klicked cards
  restart(); // restart the game if necessary
}



playGame(); //executing the actual game
