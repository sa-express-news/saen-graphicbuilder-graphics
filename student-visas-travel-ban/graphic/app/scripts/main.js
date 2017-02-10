/* global pym */

(function() {
  'use strict';

  var pymChild,
      $target,
      $curr;

  function sendHeight () {
    if (pymChild) {
      pymChild.sendHeight();
    }
  }

  function render () {
    sendHeight();
  }

  function closeCard ($card) {
    if ($card.hasClass('open')) {
      $card.next().slideToggle(200, 'swing', sendHeight);
      $card.toggleClass('open');
    }
  }

  function openCard ($card) {
    if (!$card.hasClass('open')) {
      $card.next().slideToggle(200, 'swing', sendHeight);
      $card.toggleClass('open');
    }
  }

  function shuffleCards (idx, card) {
    $curr = $(card);
    if ($curr.is($target)) {
      openCard($curr);
    } else {
      closeCard($curr);
    }
  }

  jQuery(document).ready(function(){
    var $cards = $('#graphic-container .card-head');
    $cards.click(function() {
      $target = $(this);
      $cards.each(shuffleCards);
      return false;
    }).next().hide();

    $('#graphic-container .first .card-head').toggleClass('open');
    $('#graphic-container .first .bar-chart-wrap').show();
    sendHeight();
  });

  function load() {
    pymChild = new pym.Child({
      renderCallback: render
    });
  }

  window.onload = load;
})();
