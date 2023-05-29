
import warnings
warnings.filterwarnings("ignore", message=".*The 'nopython' keyword.*")

import os
import shap
import json
import folium
import joblib

import numpy as np
import pandas as pd
import geopandas as gpd

from sklearn.preprocessing import LabelEncoder  

from flask import Flask, render_template, jsonify, request

# TO DO
# Ajustar o cmap para ter o max e o min
# ajustar rota do SHAP para calcular somente as cidades abertas
# Adicionar página de metodologia



def force_plot_html(explainer, shap_values, dado):
    force_plot = shap.force_plot(explainer.expected_value, shap_values, dado,
                    matplotlib=False)
    
    shap_html = f"<head>{shap.getjs()}</head><body>{force_plot.html()}</body>"

    return shap_html

app = Flask(__name__)
# env_config = os.getenv("PROD_APP_SETTINGS", "config.DevelopmentConfig")
# app.config.from_object(env_config)

@app.route('/')
def index():

    geojson = gpd.read_file('geojson/rsgeojson.json')

    geojson["longitude"] = geojson["geometry"].centroid.x
    geojson["latitude"] = geojson["geometry"].centroid.y

    # Carregar o modelo e obtem as previsões dos casos de COVID-19
    modelo = joblib.load('ml/model.joblib')
    dados = pd.read_pickle('ml/testesite.pkl')
    municipios = pd.read_pickle('ml/municipios.pkl')
    
    pred = modelo.predict(dados)

    new_value = pred/(dados['homens'].values + dados['mulheres'].values)

    previsoes = pd.DataFrame()
    previsoes['id'] = dados['municipio']
    previsoes['casos'] = new_value
    previsoes['qnt_casos'] = pred.astype(np.int32)

    geojson = geojson.merge(previsoes, on='id')

    # Criar o mapa usando a biblioteca Folium
    mapa = folium.Map(location=[-30.0346, -53.2177], zoom_start=7, tiles='OpenStreetMap')

    # Adicionar o GeoJSON com os dados do mapa
    choropleth = folium.Choropleth(
        geo_data=geojson,
        data=previsoes,
        columns=['id', 'casos'],
        key_on='feature.properties.id',
        fill_color='RdPu',
        fill_opacity=1.0,
        line_opacity=0.2,
        popup='<h2>Teste</h2>',
        legend_name='Previsões de Casos de COVID-19',
        # tooltip=folium.GeoJsonTooltip(fields=['name', 'casos'], aliases=['Município:', 'Casos:'], labels=True, sticky=True),
        highlight = lambda x: {'weight':3,'fillColor':'grey'}
        
    ).add_to(mapa)

    folium.LayerControl().add_to(mapa)

    # choropleth.geojson.add_child(folium.features.GeoJsonTooltip(fields=['name', 'qnt_casos'], 
    #                                                             aliases=['Município:', 'Novos casos:'], 
    #                                                             labels=True,
    #                                                             popup=f"<h4>['name']</h4> <br> <h5>['qnt_casos'] Casos</h5>"))

    # print(choropleth)

    mapa.get_root().header.add_child(folium.elements.CssLink('/static/css/style.css'))
    mapa.get_root().header.add_child(folium.elements.CssLink('/static/css/style-preset.css'))
   
    mapa.get_root().header.add_child(folium.elements.JavascriptLink('/static/js/plugins/popper.min.js'))
    mapa.get_root().header.add_child(folium.elements.JavascriptLink('/static/js/plugins/simplebar.min.js'))
    mapa.get_root().header.add_child(folium.elements.JavascriptLink('/static/js/plugins/bootstrap.min.js'))
    # mapa.get_root().header.add_child(folium.elements.JavascriptLink('/static/js/pages/dashboard-default.js'))

    mapa.get_root().header.add_child(folium.elements.JavascriptLink('https://code.jquery.com/jquery-3.6.0.min.js'))
    mapa.get_root().header.add_child(folium.elements.JavascriptLink('/static/js/modal.js'))

    for _, municipio in geojson.iterrows():
        dado = dados[dados['municipio'] == municipio['id']]
        # shap_atual = explainer.shap_values(dado)

        html = ""# html = f"<h4>{municipio['name']}</h4> <br> <h5>{municipio['qnt_casos']} Casos</h5> <p>{force_plot_html(explainer,shap_atual,dado)} </p"
        iframe = folium.IFrame(html=html, width=500, height=300)
        popup = folium.Popup(iframe, max_width=2650)

        folium.Marker(
            location=[municipio['latitude'], municipio['longitude']],
            # popup=folium.Popup(),#f"<a href='/municipio/{municipio['id']}' data-toggle='modal' data-target='#municipioModal'>{municipio['id']}</a>",
            icon=folium.DivIcon(html=f'<i class="fa fa-location-dot municipio-btn" style="color: #673ab7;" data-municipio-id="{municipio["id"]}"></i>')
        ).add_to(mapa)
        

    # Salvar o mapa em um arquivo HTML temporário
    mapa.save('./templates/temp_map.html')

    html_map = mapa._repr_html_()

    # Ordenar os municípios por número de casos em ordem decrescente
    previsoes_ = previsoes.sort_values('casos',ascending=False)

    previsoes_['name'] = municipios.inverse_transform(previsoes_['id'])
    previsoes_['name'] = previsoes_['name'].str.title()
    print(previsoes_['name'].dtype)

    # Selecionar os municípios mais graves (por exemplo, os 5 primeiros)
    municipios_graves = previsoes_.head(10)


    # Renderizar o template HTML com o mapa
    return render_template('index.html', map=html_map, municipios_graves=municipios_graves)

@app.route('/municipio_info', methods=['GET'])
def municipio_info():

    municipio_id = request.args.get('id')  # Obtém o ID do município da requisição
    

    # Carregar o modelo e obtem as previsões dos casos de COVID-19
    modelo = joblib.load('ml/model.joblib')
    dados = pd.read_pickle('ml/testesite.pkl')
    municipios = pd.read_pickle('ml/municipios.pkl')

    explainer = shap.TreeExplainer(modelo, dados.astype(float), feature_names=dados.columns)
    dado = dados[dados['municipio'] == int(municipio_id)]
    pred = modelo.predict(dado)
    
    shap_atual = explainer.shap_values(dado)
    shap_html = force_plot_html(explainer,shap_atual,dado)
    
    dado['name'] = municipios.inverse_transform(dado['municipio'])
    dado['name'] = dado['name'].str.title()
    
    # Aqui você pode fazer a lógica para recuperar as informações do município com base no ID
    # Substitua este exemplo com a sua própria lógica de obtenção de informações do município

    new_value = pred/(dado['homens'].values + dado['mulheres'].values)

    # Lógica para definir a gravidade do munícipio
    gravidade = 0 

    if new_value[0] > 0.009:
        gravidade = 3
    elif new_value[0] > 0.005:
        gravidade = 2
    else:
        gravidade = 1

    municipio = {
        'name': dado['name'].iloc[0],
        'qnt_casos': int(pred),
        'shap': shap_html,
        'gravidade': gravidade,
    }
    
    return jsonify({'municipio': municipio})

@app.route('/metodologia')
def metodologia():
    return render_template('metodologia.html')


if __name__ == '__main__':
    app.run(host="localhost", port=8080, debug=True)
