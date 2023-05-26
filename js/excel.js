$(document).ready(function() {

    var tabela = "";
    var tituloArquivo = "";
    var dataArquivo = "";
    
    //Calcula IMC
    $(".btn-calcular").click(function() {
        var tbl = tabelaCalculadaImc();      
        console.log(tbl);
        atualizaTabela(tbl);
    });

    $(".btn-txt").click(function() {
        var tbl = tabelaCalculadaImc();  
        atualizaTabela(tbl);
        var dados = formataTxt(tbl);
        downloadArquivoTxt(dados);
    });

    //Formatação dados txt
    function formataTxt(lista){
        var retorno = "";
        for (var i = 0; i < lista.length; i++) {
            retorno += "Nome: " + lista[i].nome + "\n";
            retorno += "Peso: " + lista[i].peso + "\n";
            retorno += "Altura: " + lista[i].altura + "\n";
            retorno += "IMC: " + lista[i].imc + "\n\n";
        }
        retorno += "\n"
        return retorno;
    }

    //Geração de excel
	$(".btn-xls").click(function() { 
        dataArquivo = retornaDataAtual().replace("/","-")
        tituloArquivo += "LISTA_USUARIOS_" + dataArquivo;

        var tbl = tabelaCalculadaImc();
        var tabelaTitulo = retornaTituloTabela();
        tabela = formataTabela(tabelaTitulo, tbl);        
        downloadArquivoExcel(tabela);
    });

    //Atualiza a tabela com a coluna do IMC calculado
    function atualizaTabela(lista){
        $('.tbl-usuarios tbody').empty();
        var tabelaBody = "";       

        //tbody    
        for (var i = 0; i < lista.length; i++) {
            var n = i + 1;
            tabelaBody += "<tr>";
            tabelaBody += "<td>" + lista[i].nome + "</td>";
            tabelaBody += "<td>" + lista[i].peso + "</td>";
            tabelaBody += "<td>" + lista[i].altura + "</td>";
            tabelaBody += "<td>" + lista[i].imc + "</td>";
            tabelaBody += "</tr>";
        }
        $('.tbl-usuarios tbody').append(tabelaBody);
    }

    //Retorna os dados da tabela que está na tela
    function retornaDadosTabelas(){
        
        var tbl = $('.tbl-usuarios tr:has(td)').map(function(i, v) {
            var $td =  $('td', this);
            return {
                id: i++,
                nome: $td.eq(0).text(),
                peso: $td.eq(1).text(),
                altura: $td.eq(2).text(),
                imc: $td.eq(3).text()              
            }
        }).get();
        return tbl;
    }

    //Fórmula de cálculo do IMC
    function calculaImc(peso,altura){
        var retorno = "";
        var a2 = altura * altura;
        retorno = parseFloat(peso / a2).toFixed(2);
        return retorno;
    }

    //Cálculo de IMC refletido na tabela
    function tabelaCalculadaImc(){
        var tbl = retornaDadosTabelas();
        for(var i = 0; i < tbl.length; i++){
            var peso = parseFloat(tbl[i].peso).toFixed(2);
            var altura = parseFloat(tbl[i].altura).toFixed(2);
            tbl[i].imc = calculaImc(peso,altura);
        }
        return tbl;
    }

    //Retorna a data atual
    function retornaDataAtual(){

        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let currentDate = `${day}/${month}/${year}`;
        return currentDate;
    }

    //Retorna o Título da Tabela
    function retornaTituloTabela() {
        var tabelaTitulo = "";

        var estilo = "style='background-color:#ccc;'";

        var tabelaDado = "<tr class='cor'>"; 
            tabelaDado += "<td " + estilo + "></td>";
            tabelaDado += "<td " + estilo + ">NOME</td>";
            tabelaDado += "<td " + estilo + ">PESO</td>";
            tabelaDado += "<td " + estilo + ">ALTURA</td>";
            tabelaDado += "<td " + estilo + ">IMC</td>";
        tabelaTitulo = "<thead>" + tabelaDado + "</tr></thead>";
        return tabelaTitulo;
    }
    
    //Cria o novo html que dará origem ao excel
    function formataTabela(tabelaTitulo, lista){
        var retorno = "";
        var htm = "<!DOCTYPE html><html><head><title>RELAT&Oacute;RIO</title>";
        var estilo = "<style>tr.cor th{background-color:#333;font-weight:bold;}</style>";
        var tabela = htm + estilo + "</head><body><table>";

        var tabelaBody = "";       

        //tbody
        tabelaBody = "<tbody>";      
        for (var i = 0; i < lista.length; i++) {
            var n = i + 1;
            tabelaBody += "<tr>";
            tabelaBody += "<td>" + n + "</td>";
            tabelaBody += "<td>" + lista[i].nome + "</td>";
            tabelaBody += "<td>" + lista[i].peso + "</td>";
            tabelaBody += "<td>" + lista[i].altura + "</td>";
            tabelaBody += "<td>" + lista[i].imc + "</td>";
            tabelaBody += "</tr>";
        }
        tabelaBody += "</tbody>";

        //thead + tbody
        tabela += tabelaTitulo + tabelaBody + "</table></body></html>";

        if(lista.length > 0) { retorno = tabela; }

        return retorno;
    }

    //Geração do txt
    function downloadArquivoTxt(data){
        var a = document.createElement('a');
         const file = new Blob([data], { type: 'text/plain' });
         a.href = URL.createObjectURL(file);
         a.download = "sample.txt";
         a.click();
         URL.revokeObjectURL(a.href);                     
    }    

    //Geração do Excel
    function downloadArquivoExcel(data){
        var a = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel;charset=utf-8';
        a.href = data_type + ', ' + encodeURIComponent(data);
        a.download = tituloArquivo + '.xls';
        a.click();                       
    }

});
