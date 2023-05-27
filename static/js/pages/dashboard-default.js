'use strict';
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    floatchart();
  }, 500);
});

window.onload = () => {
  const myModal = new bootstrap.Modal('#onload');
  myModal.show();
}

function openModal() {
  var modal = new bootstrap.Modal("#onload");
  modal.show();
}

function floatchart() {
  (function () {
    var options = {
      chart: {
        type: 'line',
        height: 90,
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#FFF'],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      series: [
        {
          name: 'series1',
          data: [45, 66, 41, 89, 25, 44, 9, 54]
        }
      ],
      yaxis: {
        min: 5,
        max: 95
      },
      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function (seriesName) {
              return 'Total Earning';
            }
          }
        },
        marker: {
          show: false
        }
      }
    };
    var chart = new ApexCharts(document.querySelector('#tab-chart-1'), options);
    chart.render();
  })();
  (function () {
    var options = {
      chart: {
        type: 'line',
        height: 90,
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#FFF'],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      series: [
        {
          name: 'series1',
          data: [35, 44, 9, 54, 45, 66, 41, 69]
        }
      ],
      yaxis: {
        min: 5,
        max: 95
      },
      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function (seriesName) {
              return 'Total Earning';
            }
          }
        },
        marker: {
          show: false
        }
      }
    };
    var chart = new ApexCharts(document.querySelector('#tab-chart-2'), options);
    chart.render();
  })();
  (function () {
    var options = {
      chart: {
        type: 'bar',
        height: 480,
        stacked: true,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%'
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#d3eafd', '#2196f3', '#673ab7', '#e1d8f1'],
      series: [
        {
          name: 'Investment',
          data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
        },
        {
          name: 'Loss',
          data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
        },
        {
          name: 'Profit',
          data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10]
        },
        {
          name: 'Maintenance',
          data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
        }
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      xaxis: {
        type: 'category',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      grid: {
        strokeDashArray: 4
      },
      tooltip: {
        theme: 'dark'
      }
    };
    var chart = new ApexCharts(document.querySelector('#growthchart'), options);
    chart.render();
  })();
  (function () {
    var options = {
      chart: {
        type: 'area',
        height: 95,
        stacked: true,
        sparkline: {
          enabled: true
        }
      },
      colors: ['#673ab7'],
      stroke: {
        curve: 'smooth',
        width: 1
      },
      series: [
        {
          data: [0, 15, 10, 50, 30, 40, 25]
        }
      ]
    };
    var chart = new ApexCharts(document.querySelector('#bajajchart'), options);
    chart.render();
  })();
}

// $(document).ready(function() {
//   // Função para criar o modal
//   function criarModal() {
//     // Criar os elementos do modal
//     var modal = document.createElement("div");
//     modal.id = "municipiosModal";
//     modal.className = "modal fade";
//     modal.tabIndex = "-1";
//     modal.setAttribute("role", "dialog");
//     modal.setAttribute("aria-labelledby", "modalLabel");
//     modal.setAttribute("aria-hidden", "true");

//     var modalDialog = document.createElement("div");
//     modalDialog.className = "modal-dialog";
//     modal.appendChild(modalDialog);

//     var modalContent = document.createElement("div");
//     modalContent.className = "modal-content";
//     modalDialog.appendChild(modalContent);

//     var modalHeader = document.createElement("div");
//     modalHeader.className = "modal-header";
//     modalContent.appendChild(modalHeader);

//     var modalTitle = document.createElement("h5");
//     modalTitle.className = "modal-title";
//     modalTitle.id = "modalLabel";
//     modalHeader.appendChild(modalTitle);

//     var closeButton = document.createElement("button");
//     closeButton.type = "button";
//     closeButton.className = "close";
//     closeButton.setAttribute("data-dismiss", "modal");
//     closeButton.setAttribute("aria-label", "Fechar");
//     closeButton.innerHTML = "<span aria-hidden='true'>&times;</span>";
//     modalHeader.appendChild(closeButton);

//     var modalBody = document.createElement("div");
//     modalBody.className = "modal-body";
//     modalContent.appendChild(modalBody);

//     // Adicionar o modal ao documento
//     document.body.appendChild(modal);
//   }

//   // Chamar a função para criar o modal
//   criarModal();
// });

$(document).ready(function() {
  // Função para carregar informações do município e exibir o modal
  function showMunicipioInfo(municipioId) {
    $.ajax({
      url: '/municipio_info',
      method: 'GET',
      data: { id: municipioId },
      success: function(response) {
        var municipio = response.municipio;
        
        // Atualizar o conteúdo do modal com as informações do município
        $('#municipioNome').text(municipio.name);
        $('#qntCasos').text(municipio.qnt_casos);
        $('#shap').html(municipio.shap);

        if (municipio.gravidade == 1){
          window.parent.$('#medidas').html('<br>Higienização das mãos<br>Etiqueta respiratória<br>Vacinação contra a COVID-19');
        }else if (municipio.gravidade == 2){
          window.parent.$('#medidas').html('<br>Higienização das mãos<br>Etiqueta respiratória<br>Uso de máscaras na população em geral<br>Vacinação contra a COVID-19');
        }else if (municipio.gravidade == 3){
          window.parent.$('#medidas').html('<br>Higienização das mãos<br>Etiqueta respiratória<br>Uso de máscaras na população em geral<br>Distanciamento social<br>Vacinação contra a COVID-19');
        }
        
        // Exibir o modal
        $('#municipiosModal').modal('show');
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



// $(document).ready(function() {
//   // Quando um botão com a classe 'municipio-btn' for clicado
//   $('.municipio-btn').click(function() {
//     var municipioId = $(this).data('municipio-id'); // Obtém o ID do município a partir do botão clicado
    
//     // Faz uma requisição AJAX para obter as informações do município
//     $.ajax({
//       url: '/municipio_info',
//       type: 'GET',
//       data: { id: municipioId }, // Envia o ID do município como parâmetro
//       success: function(response) {
//         console.log(response)
//         var municipio = response.municipio;
        
//         // Preenche o modal com as informações do município
//         $('#modal-body').html('<p>Nome: ' + municipio.name + '</p>' +
//                               '<p>Quantidade de Casos: ' + municipio.qnt_casos + '</p>' +
//                               '<p>População: ' + municipio.populacao + '</p>' +
//                               '<p>Taxa de Contágio: ' + municipio.taxa_contagio + '</p>');
        
//         // Exibe o modal
//         $('.municipiosModal').css('display', 'block');
//       },
//       error: function() {
//         alert('Ocorreu um erro ao obter as informações do município.');
//       }
//     });
//   });
  
//   // Quando o botão de fechar do modal for clicado
//   $('.close').click(function() {
//     // Fecha o modal
//     $('.modal').css('display', 'none');
//   });
// });