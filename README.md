# Este proyecto, fue diseñado para la prueba y capacitacion de mis habilidades individuales, en conjunto con mi compañera Clarita Zolorza.

Este proyecto fue presentado para la mataria de Proyecto Final. De la Escuela Tecnica 3139 Gral. Martin Miguel de Guemes, Salta, Salta Capital. Donde lo presentado es una aplicacion web realizada con elementos HTML, CSS, Js para el desarrollo de las distintas pantallas, estilos y animaciones (Frontend) y Python junto con Flask para la configuracion de las rutas con sus distintas funciones (Backend). La aplicacion web se llama EdnaIA, que contiene elementos tipicos de una web que tienen como atractivo una inteligencia artificial, como puede ser el mismo Chatgpt o Leonardo.AI. Presentando 2 pantallas esneciales que hacen uso de la inteligencia artificial de gemma2:2b y qwen2.5:0.5b todo orientado a ayudar a un publico interesado en la generacion de historias y ayuda sobre escriutra de los mismos, perfiles como estudiantes, periodistas, escritores novatos y profesionales, o cualquier interesado en la prueba de este sistema.

## Tabla de Contenidos
- [Stack Tecnologico](#StackTecnologico)
- [Evaluacion](#Evaluacion)
- [Actualizaciones Futuras](#ActualizacionesFuturas)

## Stack Tecnologico
Durante la introduccion se presentaron algunos de los elementos usados para este proyecto pero en esta seccion se va a explicar de mejor forma y como se aplicaron dichos recursos.

1. Uso de Python y Librerias
Python se utiliza como lenguaje de programacion principal, para el desarrollo del backend, sirviendo como base para la logica del servidor, manejo de usuarios, sesiones, y la integraciones de diversos servicios como la conexion con la base de datos y correos electronicos.

Flask:
- Uso: es el framework principal para crear aplicaciones web, permitiendo manejar rutas y renderizar plantillas HTML y gestionar solicitudes HTTP.
- Comopoentes usados:
    - render_template: renderizacion de las plantillas HTML dinamicas.
    - request: gestion de datos enviados desde el cliente (formularios o peticiones HTTP).
    - redirect y url_for: redireccion entre rutas y generacion de URLs dinamicas.
    - flash: envio de mensajes temporales para el usuario.
    - jsonify: retorno de datos en formato JSON para interacciones con el frontend.
    - session: gestion de variables de sesion para mantener el estado del usuario.

Flask-SQLAlchemy:
- Uso: interactuar con la base de datos de manera simplicificada mediante un ORM, este define los modelos como clases Python (Usuario, Sesion, Mensaje) y realiza operaciones CRUD como crear, leer, actualizar, eliminar sin escribir SQL directamente. Permite la configuracion con la conexion a MySQL para persistencia de datos, como usuarios y sesiones de chat.

Werzeug.security:
- Uso: proporciono herramientas de seguridad para manejar contraseñas de manera segura donde:
    - generate_password_hash, cifra contraseñas antes de almacenarlas en la base de datos.
    - check_password_hash: verifica contraseñas ingresadas contra su hash almacenado.

Datetime:
- Uso: manejo de fechas y horas

Ollama
- Uso: conexion con los modelos de IA que generan respuestas en lenguaje natural, donde ollama.generate genera las respuestas de texto basados en un contexto proporcionado.

2. HTML: es el lenguaje base para la estructura del frontend de la aplicacion. Define la posicion de los elementos visuales. Donde se realizaron estructuras de paginas, como las rutas de inicio, inicioSesion, chatFinal, etc. Y formularios de datos para registrar o iniciar sesion. Por ultimo las platnillas dinamicas, qye junto con la integracion de Flask mediante render_template para generar contenido dinamico basado en variables del servidor.

3. CSS: define el diseño y estilo visual de la aplicacion, mejorando la experiencia del usuario, ademas se uso para tener un diseño responsivo, asegura que la interfaz se adapte a dispositivos de diferentes tamaños como celulares o tablets. Y como lo mas importante se uso para darle un diseño, colores y estilo unico.

4. JavaScript: proprociona interactividad y funcionalidades dinamicas en el front, permitiendo comunicacion con el servidor y respuestas inmediatas sin recargar la pagina. Pero generalmente se utilizo para complementar el UX/UI de la aplicacion, con animaciones, cambios de estilos en pantallas como la del chatFinal.

## Evaluacion
El hecho de tener que desarrollar una aplicacion web para una materia importante de mi orientacion (informatica), fue un desafio que me dio lugar a varias enseñansas y a interesarme en el mundo de los distintos modelos de intelgencia artificial. Durante el principio no fue un proyecto elegido por los miembros del equipo sino que fue una de las opciones que nos dejaron en nuestra materia por diversos casos que no nos permitian realizar otros proyectos, que aunque tenga su parte mala sin este proyecto no hubiera indagado e investigado sobre elementos como el desarrollo de aplicaciones web y Ollama. Y uanque este sistema ya fue presentado y aprobado en la materia, me di cuenta de varias debilidades de este proyecto y posibles mejoras pque pueden ser aplicadas en cuestion de tiempo.

  - Debilidades:
    Se ejecuta de forma local, eso hace que elementos como Ollama (especificamente los modelos ejecutandose como gemma2:2b) ocupen recursos de la computadora y cuento con un equipo modesto para este tipo de programas.
    Falta de inovacion, debido a que de forma autocritica, hay  IAs que logran un efecto mejor que este, en el ambito que apuntamos para el proyecto.
    Utilizacion de modelos de IA de niveles bajos, aunque estos sean muy buenos y cumplen con lo requerido, no son tan capaces como los otros que ofrecen Ollama. Esto se relaciona con con lo dicho anteriormente de la ejecucion local.

  - Posibles Mejoras:
    Integracion a un servidor web, es una opcion de mejora para no tener que someter mi computadora a procesos dificiles para esta. Pero eso implicaria contratar servicios buenos y potentes, eso significa que van a ser de pago como AWS.
    Mejora en la configuracion de los modelos, estuve investigando y se puede modificar o crear modelos personalizados, esto puede mejorar muchisimo la respuesta de la IA sobre el entrono al que apuntamos.
    Aplicacion de otros tipo de IA de generacion, no solo las que ya usamos que son de generacion de texto sino tambien agregar imagenes, la otra vez se me ocurrio eso con la situacion de que un profesor quiera escribir un cuento para niños de primaria y que te de el cuento junto como iamgenes como si fuera un cuento digitalizado.
    Futuras mejoras a pensar

