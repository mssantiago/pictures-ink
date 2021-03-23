$(document).ready(function () {

  getAllImgs();
  $(document).on('click',".deleteImagen", function(){
    var imagen =  $(this).data('id');
    Swal.fire({
      title: 'Estas seguro de eliminar la foto?',
      showDenyButton: true,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        deleteImg(imagen)
      } else if (result.isDenied) {
        Swal.fire('No fue eliminada', '', 'info')
      }
    })
   
   });

  $("#upload-file-form").on("submit", function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "/uploadimg",
      data: new FormData(this),
      processData: false,
      contentType: false,
      cache: false,
      enctype: "multipart/form-data",
      complete: function (result) {
        getAllImgs();
      },
      success: function (data) {
        Swal.fire('Completado!', '', 'success')
        $("#upload-file-input").val("");

      },
      error: function (e) {
        Swal.fire('Error', 'Seleccione un archivo, o verifique que el archivo subido pese menos de 128KB', 'error')
      },
    });
  });
});

function deleteImg(image) {
  $.ajax({
    type: "DELETE",
    url: "/deleteBlob",
    data: {blobName: image },
    beforeSend: function (r) {},
    success: function (result) {
      Swal.fire('Eliminada!', '', 'success')
      getAllImgs();
    },
    error(r) {
      Swal.fire('Error!', '', 'error')
    },
  });
}

function getAllImgs() {
  $.ajax({
    type: "GET",
    url: "/blobs",
    beforeSend: function (r) {},
    complete: function (result) {},
    success: function (result) {
      $("#photos").html(``);
      for (const key of result) {
        $("#photos").append(
          `<div class="col-4"> 
              <div class="hovereffect">
                <img class="img-responsive" src="receiveName?containerName=containerimgs&namePhoto=${key}" width="100%" height="100%">
              <div class="overlay">
                  <h2>${key}</h2>
                 <button class="deleteImagen btn btn-md btn-secondary"data-id="${key}">Eliminar</button>
                </div>
              </div>
          </div>`
        );
      }
    },
    error(r) {
      Swal.fire('Error!', '', 'error')
    },
  });
}
