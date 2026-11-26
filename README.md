# Fimapa — Rotas para ortofoto

Gerador de planos de voo em grade para mapeamento aéreo e ortofotos com o drone **FIMI X8 Tele Max**, exportando rotas em KML compatíveis com o aplicativo **FIMI Navi 3.0**.
Responsável técnico: Clessiano Antunes (TRT/CFT).

Site: https://clarkve12.github.io/rota-grade/

## Funções
- **Mapa com satélite** (Esri World Imagery / Clarity e OpenStreetMap): marcar os cantos da área, lupa para precisão, captura de cantos pelo GPS do celular
- **Grade automática** a partir do polígono: faixas, sobreposição frontal e lateral, margem, ângulo e uma, duas (cruzada) ou três (diagonal) direções de voo
- **Divisão por bateria**, com tempo de voo, reserva e calibração da bateria; rota contínua ou separada por direção
- **Predefinições de ortofoto** (30 m · 2,5 m/s, 40 m · 3 m/s, 50 m · 4 m/s, 60 m · 5 m/s) e barra de altura de 40 a 60 m com velocidade automática
- Cálculo de **resolução (GSD)**, arrasto da imagem e **intervalo de disparo da câmera**
- **Relevo**: análise e compensação de altura pelo terreno
- **Sobreposição com o SIGEF**: ao desenhar a poligonal, consulta o GeoPortal do INCRA e avisa se a área sobrepõe ou encosta em parcelas certificadas (nome, área, matrícula, CNS, código SNCR), além da camada “Parcelas SIGEF (INCRA)” no mapa
- **Pontos de controle (GCP)** distribuídos na área, com coordenadas UTM, para alvos e checkpoints no RTK
- **Simulador de voo** no mapa
- **Relatório em PDF** com croqui, ficha do operador e lista de baterias
- **Projetos salvos** no próprio aparelho
- **Funciona offline** (app instalável/PWA), com cache das imagens de satélite já visitadas

## Arquivos KML gerados
Nome no formato `Projeto_Direção_Altura-Velocidade_Bateria_Data.kml`, por exemplo:
`Fazenda_Sul_D2-Cruzada-NS_30m-2,5ms_bat3de8_21-11.kml`

Os arquivos são importados no FIMI Navi (versão modificada, com importação de KML em lote e opções de exportar/apagar rotas).
O intervalo de disparo e a inclinação do gimbal não vão no KML (o drone não aplica o ângulo da rota): incline a câmera para −90° manualmente e, no FIMI Navi, ligue “Foto com lapso de tempo” na opção indicada pelo Fimapa (o app oferece 2, 5, 10, 30 e 60 s).

## Serviços externos usados (gratuitos, sem chave)
- Imagens de satélite: Esri World Imagery e Esri Clarity
- Mapa de ruas: OpenStreetMap
- Relevo: Terrain Tiles (AWS / Mapzen)
- Parcelas certificadas: GeoPortal do INCRA (WMS/WFS, camada pública geonode:sigef_geo)
- Biblioteca de mapas: Leaflet
