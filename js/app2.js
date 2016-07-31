$('.map-icon').click(function() {
  $('.map-icon').removeClass('selected');
  if (!$(this).hasClass('selected')) {
    $(this).addClass('selected');
  }
})
