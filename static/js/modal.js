// $(document).ready(function() {
//     // Função para criar o modal
//     function criarModal() {
//       // Criar os elementos do modal
//       var modal = document.createElement("div");
//       modal.id = "municipiosModal";
//       modal.className = "modal fade";
//       modal.tabIndex = "-1";
//       modal.setAttribute("role", "dialog");
//       modal.setAttribute("aria-labelledby", "modalLabel");
//       modal.setAttribute("aria-hidden", "true");
  
//       var modalDialog = document.createElement("div");
//       modalDialog.className = "modal-dialog";
//       modal.appendChild(modalDialog);
  
//       var modalContent = document.createElement("div");
//       modalContent.className = "modal-content";
//       modalDialog.appendChild(modalContent);
  
//       var modalHeader = document.createElement("div");
//       modalHeader.className = "modal-header";
//       modalContent.appendChild(modalHeader);
  
//       var modalTitle = document.createElement("h5");
//       modalTitle.className = "modal-title";
//       modalTitle.id = "modalLabel";
//       modalHeader.appendChild(modalTitle);
  
//       var closeButton = document.createElement("button");
//       closeButton.type = "button";
//       closeButton.className = "close";
//       closeButton.setAttribute("data-dismiss", "modal");
//       closeButton.setAttribute("aria-label", "Fechar");
//       closeButton.innerHTML = "<span aria-hidden='true'>&times;</span>";
//       modalHeader.appendChild(closeButton);
  
//       var modalBody = document.createElement("div");
//       modalBody.className = "modal-body";
//       modalContent.appendChild(modalBody);
  
//       // Adicionar o modal ao documento
//       document.body.appendChild(modal);
//     }
  
//     // Chamar a função para criar o modal
//     criarModal();
//   });
  
  $(document).ready(function() {
    // Função para carregar informações do município e exibir o modal
    function showMunicipioInfo(municipioId) {
      $.ajax({
        url: '/municipio_info',
        method: 'GET',
        data: { id: municipioId },
        success: function(response) {
          var municipio = response.municipio;
          console.log(municipio)
          
          // Atualizar o conteúdo do modal com as informações do município
          window.parent.$('#municipioNome').text(municipio.name);
          window.parent.$('#qntCasos').text(municipio.qnt_casos);
          window.parent.$('#shap').html(municipio.shap);

          if (municipio.gravidade == 1){
            window.parent.$('#medidas').html('<br>Higienização das mãos<br>Etiqueta respiratória<br>Vacinação contra a COVID-19');
          }else if (municipio.gravidade == 2){
            window.parent.$('#medidas').html('<br>Higienização das mãos<br>Etiqueta respiratória<br>Uso de máscaras na população em geral<br>Vacinação contra a COVID-19');
          }else if (municipio.gravidade == 3){
            window.parent.$('#medidas').html('<br>Higienização das mãos<br>Etiqueta respiratória<br>Uso de máscaras na população em geral<br>Distanciamento social<br>Vacinação contra a COVID-19');
          }
          
          // Exibir o modal
          window.parent.$('#municipiosModal').modal('show');
        },
        error: function(error) {
          console.log('Erro ao carregar informações do município:', error);
        }
      });
    }
  
    $('.closeModal').click(function() {
          // Fecha o modal
          $('#municipiosModal').modal('toggle');
    });
    
    // Evento de clique no botão para exibir o modal
    $('.municipio-btn').click(function() {
      var municipioId = $(this).data('municipio-id'); // Obtém o ID do município a partir do botão clicado
      showMunicipioInfo(municipioId);
    });
  });
  