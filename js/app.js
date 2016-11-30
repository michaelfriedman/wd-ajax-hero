(function() {
  'use strict';

  const movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  // ADD YOUR CODE HERE
  $('button').click((event) => {
    event.preventDefault();
    const input = $('input').val();

    if (input.trim() === '') {
      Materialize.toast('Please enter a movie title.', 4000);

      return;
    }

    const $xhr = $.ajax({
      method: 'GET',
      url: `http://www.omdbapi.com/?s=${input}`,
      dataType: 'json'
    });

    $xhr.done((data) => {
      if ($xhr.status !== 200) {
        return;
      }
      $('input').val('');
      const response = data.Search;

      for (const index in response) {
        const movie = {
          title: response[index].Title,
          id: response[index].imdbID,
          poster: response[index].Poster,
          year: response[index].Year
        };
        if (movie.poster !== 'N/A') {
          movies.push(movie);
        }
      }
      renderMovies();
    });

    $xhr.fail((err) => {
      Materialize.toast
      ('Sorry, we are experiencing technical difficulties.', 4000);
      console.error(err.statusText);
    });
  });
})();
