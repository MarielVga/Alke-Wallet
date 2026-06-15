$(document).ready(function() {

    // inicio de sesion
    


    // menu
    if ($('#saldoPantalla').length) {
        let saldo = parseFloat(localStorage.getItem('saldo') || 0);
        $('#saldoPantalla').text(`$ ${saldo.toLocaleString('es-AR')}`);

        function redirigirConLeyenda(boton, nombrePantalla, url) {
            $(boton).click(function() {
                $('#alert-container').html(`<div class="alert alert-info text-center">Redirigiendo a ${nombrePantalla}...</div>`);
                setTimeout(() => { window.location.href = url; }, 1000);
            });
        }

        redirigirConLeyenda('#btnDepositar', 'Depositar', 'deposit.html');
        redirigirConLeyenda('#btnEnviar', 'Enviar Dinero', 'sendmoney.html');
        redirigirConLeyenda('#btnMovimientos', 'Últimos Movimientos', 'transactions.html');
    }


    // deposito
    


    // enviar dinero
    if ($('#buscador').length || $('#formEnvio').length) {
        // Buscador
        $('#buscador').on('keyup', function() {
            let valor = $(this).val().toLowerCase();
            $('#listaAgenda li').filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(valor) > -1);
            });
        });

        // Mostrar / Ocultar formulario nuevo contacto
        $('#btnMostrarFormulario').click(() => $('#formNuevoContacto').slideDown());
        $('#btnCancelarFormulario').click(() => $('#formNuevoContacto').slideUp());

        // Guardar contacto
        $('#formNuevoContacto').submit(function(e) {
            e.preventDefault();
            let cbu = $('#nuevoCBU').val();
            const cbuRegex = /^[0-9]{22}$/;
            
            if (!cbuRegex.test(cbu)) {
                alert('Error: El CBU debe contener exactamente 22 números.');
                return;
            }

            let nombre = $('#nuevoNombre').val();
            let alias = $('#nuevoAlias').val();
            
            $('#listaAgenda').append(`<li class="list-group-item contacto-item">${nombre} (Alias: ${alias})</li>`);
            $('#formNuevoContacto').slideUp()[0].reset();
        });

        // Seleccionar contacto
        $(document).on('click', '.contacto-item', function() {
            $('.contacto-item').removeClass('active');
            $(this).addClass('active');
            $('#contactoSeleccionadoTexto').text('Enviar a: ' + $(this).text());
            $('#formEnvio').slideDown();
        });

        // Enviar dinero
        $('#formEnvio').submit(function(e) {
            e.preventDefault();
            let monto = parseFloat($('#montoEnvio').val());
            let saldo = parseFloat(localStorage.getItem('saldo') || 0);

            if (monto > saldo) {
                $('#msjConfirmacion').html('<div class="alert alert-danger">Fondos insuficientes.</div>');
            } else {
                saldo -= monto;
                localStorage.setItem('saldo', saldo);

                let destinatario = $('.contacto-item.active').text();
                let movs = JSON.parse(localStorage.getItem('movimientos') || '[]');
                movs.unshift({ tipo: 'transferencia', detalle: `Envío a ${destinatario}`, monto: -monto, fecha: new Date().toLocaleDateString() });
                localStorage.setItem('movimientos', JSON.stringify(movs));

                $('#formEnvio').slideUp();
                $('#msjConfirmacion').html('<div class="alert alert-success text-center">¡Transferencia realizada con éxito!</div>');
                
                setTimeout(() => window.location.href = 'menu.html', 2000);
            }
        });
    }


    // transacciones
    

});