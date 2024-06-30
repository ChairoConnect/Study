$(document).ready(function () {
    showMainMenu();
  });
  
  function showMainMenu() {
    $('#main-menu').show();
    $('#create-deck').hide();
    $('#study-deck').hide();
    $('#create-card').hide();
    $('#study-card').hide();
    listDecks();
  }
  
  function showCreateDeck() {
    $('#main-menu').hide();
    $('#create-deck').show();
  }
  
  function createDeck() {
    const deckName = $('#deck-name').val();
    if (deckName) {
      let decks = JSON.parse(localStorage.getItem('decks')) || {};
      decks[deckName] = [];
      localStorage.setItem('decks', JSON.stringify(decks));
      showMainMenu();
    }
  }
  
  function listDecks() {
    const decks = JSON.parse(localStorage.getItem('decks')) || {};
    const deckList = $('#deck-list').empty();
    $.each(decks, function (name) {
      const deckItem = $('<div class="card mt-2"></div>');
      const deckBody = $('<div class="card-body"></div>');
      deckBody.append(`<h5 class="card-title">${name}</h5>`);
      deckBody.append(`<button class="btn btn-primary" onclick="showDeck('${name}')">Study</button>`);
      deckBody.append(`<button class="btn btn-danger ml-2" onclick="deleteDeck('${name}')">Delete</button>`);
      deckItem.append(deckBody);
      deckList.append(deckItem);
    });
  }
  
  function showDeck(deckName) {
    $('#main-menu').hide();
    $('#create-card').hide();
    $('#study-deck').show();
    $('#deck-title').text(deckName);
    listCards(deckName);
  }
  
  function deleteDeck(deckName) {
    let decks = JSON.parse(localStorage.getItem('decks')) || {};
    delete decks[deckName];
    localStorage.setItem('decks', JSON.stringify(decks));
    showMainMenu();
  }
  
  function listCards(deckName) {
    const decks = JSON.parse(localStorage.getItem('decks')) || {};
    const cards = decks[deckName] || [];
    const cardStack = $('#card-stack').empty();
    cards.forEach((card, index) => {
      const cardItem = $('<div class="card mt-2"></div>');
      const cardBody = $('<div class="card-body"></div>');
      cardBody.append(`<p class="card-text"><strong>Question:</strong> ${card.question}</p>`);
      cardBody.append(`<p class="card-text"><strong>Answer:</strong> ${card.answer}</p>`);
      cardBody.append(`<button class="btn btn-danger" onclick="deleteCard('${deckName}', ${index})">Delete</button>`);
      cardItem.append(cardBody);
      cardStack.append(cardItem);
    });
  }
  
  function showCreateCard() {
    $('#study-deck').hide();
    $('#create-card').show();
  }
  
  function createCard() {
    const deckName = $('#deck-title').text();
    const question = $('#card-question').val();
    const answer = $('#card-answer').val();
    if (question && answer) {
      let decks = JSON.parse(localStorage.getItem('decks')) || {};
      decks[deckName].push({ question, answer });
      localStorage.setItem('decks', JSON.stringify(decks));
      showDeck(deckName);
      $('#create-card').hide();
      $('#study-deck').show();
    }
  }
  
  function deleteCard(deckName, index) {
    let decks = JSON.parse(localStorage.getItem('decks')) || {};
    decks[deckName].splice(index, 1);
    localStorage.setItem('decks', JSON.stringify(decks));
    showDeck(deckName);
  }
  
  function startStudy() {
    const deckName = $('#deck-title').text();
    showStudyCard(deckName);
  }
  
  function showStudyCard(deckName) {
    const decks = JSON.parse(localStorage.getItem('decks')) || {};
    const cards = decks[deckName] || [];
    if (cards.length > 0) {
      const randomIndex = Math.floor(Math.random() * cards.length);
      const card = cards[randomIndex];
      $('#study-question').text(card.question);
      $('#study-answer').val('');
      $('#feedback').empty();
      $('#next-btn').hide();
      $('#show-answer-btn').hide();
      $('#study-deck').hide();
      $('#study-card').show();
      $('#study-card').data('deck', deckName);
      $('#study-card').data('index', randomIndex);
    } else {
      alert('No cards in this deck.');
      showDeck(deckName);
    }
  }
  
  function checkAnswer() {
    const deckName = $('#study-card').data('deck');
    const index = $('#study-card').data('index');
    const userAnswer = $('#study-answer').val().trim().toLowerCase();
    const decks = JSON.parse(localStorage.getItem('decks')) || {};
    const correctAnswer = decks[deckName][index].answer.trim().toLowerCase();
    if (userAnswer === correctAnswer) {
      $('#feedback').text('Correct!').addClass('correct').removeClass('incorrect');
      $('#next-btn').show();
      $('#show-answer-btn').hide();
    } else {
      $('#feedback').text('Incorrect, try again!').addClass('incorrect').removeClass('correct');
      $('#show-answer-btn').show();
    }
  }
  
  function nextCard() {
    const deckName = $('#study-card').data('deck');
    showStudyCard(deckName);
  }
  
  function showAnswer() {
    const deckName = $('#study-card').data('deck');
    const index = $('#study-card').data('index');
    const decks = JSON.parse(localStorage.getItem('decks')) || {};
    const answer = decks[deckName][index].answer;
    $('#feedback').text(`The correct answer is: ${answer}`).addClass('correct').removeClass('incorrect');
    $('#next-btn').show();
    $('#show-answer-btn').hide();
  }
  
  function skipCard() {
    nextCard();
  }
  
  function tryAgain() {
    $('#feedback').empty();
    $('#show-answer-btn').hide();
  }
  
  function cancelCreateCard() {
    showMainMenu();
  }
  
  function cancelStudyCard() {
    const deckName = $('#deck-title').text();
    $('#study-card').hide();
    showDeck(deckName);
  }
  