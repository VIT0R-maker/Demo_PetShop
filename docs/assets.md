# Fotografias fornecidas

Os quatro PNGs originais têm **1487 × 1058 px**. Foram preservados na pasta de origem. O site usa somente recortes locais WebP, com qualidade 87, sem novas imagens geradas e sem hotlinks.

O script `scripts/prepare-assets.py` documenta os nomes dos originais e as coordenadas de cada recorte. Para reproduzir, instale Pillow e execute:

```sh
python scripts/prepare-assets.py --source-dir "/caminho/dos/anexos"
```

O argumento opcional `--contact-sheet /caminho/conferencia.png` gera uma prancha para inspeção. A preparação foi verificada visualmente em uma prancha; ela não faz parte dos assets publicados.

| Asset em `public/images/` | Dimensões | Enquadramento |
| --- | --- | --- |
| `hero.webp` | 1487 × 880 | Cão, gato e ambiente, espaço negativo à esquerda, sem faixa de cabeçalho |
| `hero-mobile.webp` | 787 × 735 | Os dois animais, incluindo patas do cão, para o bloco mobile |
| `service-bath.webp` | 426 × 123 | Toalhas e frasco |
| `service-grooming.webp` | 427 × 123 | Tesoura, pente e máquina |
| `service-brushing.webp` | 428 × 123 | Escova e pelagem |
| `service-nails.webp` | 426 × 126 | Cortador de unhas sobre toalha |
| `service-hydration.webp` | 427 × 126 | Frascos de cuidado com a pelagem |
| `service-products.webp` | 428 × 126 | Acessórios e itens de higiene |
| `about.webp` | 650 × 301 | Profissional escovando um cão |
| `gallery-welcome.webp` | 797 × 601 | Tutora com cão na recepção |
| `gallery-cat.webp` | 513 × 283 | Gato no banco, rosto e patas preservados |
| `gallery-space.webp` | 514 × 294 | Recepção com banco, madeira e luz natural |
| `facade.webp` | 867 × 473 | Fachada iluminada; sem mapa ou formulário do mockup |

As fotografias dos serviços têm altura limitada nos originais. Devem conservar proporção ampla para evitar aumento excessivo ou perda do assunto. Nenhum recorte contém os campos vazios ou áreas de texto dos mockups. A faixa verde da fachada e as bordas dos componentes são reconstruídas na interface.
