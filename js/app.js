// Class for a simple stopwatch
// source: https://codepen.io/_Billy_Brown/pen/dbJeh
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


// Shuffle function from http://stackoverflow.com/a/2450976
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

/*
 * Create a list that holds all of your cards
 */
var cards = ["gem", "paper-plane", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb",
              "gem", "paper-plane", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"]
var moves = 0;
var stars = 3;
var solved_cards = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


// function for displaying the html-code of shuffled cards
function showCards() {
  cards = shuffle(cards);
  $('.deck').empty();
  cards.forEach(function(card) {
    var html = '<li class="card"><i class="fas fa-'+card+'"></i></li>';
    $('.deck').append(html);
    //console.log(html);
  });
}
stopwatch.restart();
// defining the order of the game
function playGame() {

  showCards();
  compareTwoLastCards();
  restart();
}
//executing the actual game

playGame();


function compareTwoLastCards() {

  var previousCard = '';

  $('.card').click(function() {
//    console.log("previous card is: "+previousCard);

    console.log("card has been clicked");
    if (previousCard == '') {
      previousCard = $(this).children().attr('class');
      $(this).children().attr('id', 'first');
      $(this).addClass('open show');
      cardAnimation(this);

    } else {
      if (previousCard == $(this).children().attr('class')) {
        $(this).off();
        var prev = "." + previousCard;
        $(prev).off();
        console.log(prev);
        $(this).addClass('open show');
        $(this).addClass('solved');
        $('#first, #second').parent().addClass('solved');
        $('#first, #second').removeAttr('id');
        counter();
      } else {

        console.log("cards are not equal");
        $(this).addClass('open show');
        $(this).children().attr('id', 'second');
        errorAnimation(this);
        errorAnimation('#first');
        $('#first, #second').parent().addClass('wrong');
        counter();
        setTimeout(function() {
          $(this).removeClass('open show');
          $('#first, #second').parent().removeClass('open show wrong');
          $('#first, #second').removeAttr('id');
        }, 1500);
      }
      previousCard = '';
    }

    if ($('.solved').length == cards.length) {
      setTimeout(function() {
        endGame();
      }, 1000)
    }
  })
}

// function for the counter
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

function cardAnimation(card) {
  $(card).css('transform', 'rotateY(20deg)');
  $(card).animate({
    width: '+=10px'
  }, 100);
  $(card).animate({
    width: '-=10px'
  });
}

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

function endGame() {
  $('.score-panel, .card').css('display', 'none');
  $('.deck').css('display', 'none');
  $('.game-over').css('display', 'block');
  $('.game-over').prepend("<div class='fa-4x' style='color:#66ff99'><i class='far fa-check-circle'></div>");
  $('#endGameText').html("With "+moves+" Moves and "+stars+" Stars.<br>Well done!<br><br>Total time:");
  stopwatch.lap();
  restart();
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
