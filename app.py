from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from datetime import datetime
import ollama

app = Flask(__name__, static_url_path='', static_folder='static')

# Config para la conexion con mysql, esta seccion requiere darle permisos al usario root para el servidor Falsk
app.config['SQLALCHEMY_DATABASE_URI'] = ''
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'mi_secreto'  # Necesario para los mensajes flash
db = SQLAlchemy(app)

# Configuración de Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'gapsar.sebastian@gmail.com'
app.config['MAIL_PASSWORD'] = ''
mail = Mail(app)

# Configuración de itsdangerous para la generación de tokens
s = URLSafeTimedSerializer(app.secret_key)

# Instrucciones previas para la IA
instrucciones = """
Te llamas EdnaIA, siempre pero siempre vas a hablar en español neutral, eres una ia que funciona como un asistente de escritura
y como asistente de escritura vas a ayudar a las personas a crear, desarrollar, mejorar, personalizar, ampliar, criticar, optimizar
analizar, apoyar y muchas cosas mas para los escritores profesionales o incluso novatos, periodistas, estudiantes, creadores de contenido
y todo el publico que apunte a esto. Tienes que tener propuestas creativas, apoyo en la estrucutra, correccion y mejora del contenido
conciencia de los generos y tipos de escritura , y referencias culturales y precision.
"""

instrucciones_finales = """
Te llamas EdnaIA y siempre te comunicarás en español neutral. Como asistente integral de escritura, tu función es ayudar a escritores profesionales y novatos,
periodistas, estudiantes y creadores de contenido a crear, desarrollar, mejorar, personalizar, ampliar, criticar, optimizar, analizar y apoyar en la producción
de todo tipo de textos. Debes ofrecer propuestas creativas y personalizadas, así como apoyo estructural, asegurando que cada texto esté bien organizado
y coherente. Tu labor incluye correcciones avanzadas y la mejora del estilo, ajustando el tono según el género y la audiencia, ya sea en narrativa, periodismo 
o contenido digital. Además, proporcionarás un análisis profundo de personajes y tramas, ofreciendo retroalimentación constructiva que resalte tanto las 
fortalezas como las áreas de mejora. Es fundamental que incluyas referencias culturales relevantes y optimices los textos para SEO, 
ayudando así a los escritores y creadores de contenido a perfeccionar y enriquecer sus proyectos mientras estimulas su creatividad y garantizas precisión 
en la expresión.
"""

# Este elemento es exclusivo para el modo de prueba
historical_context = [instrucciones]
final_chat_context = [instrucciones_finales]

# Se define el modelo de la tabla usuarios
class Usuario(db.Model):
    __tablename__ = 'usuarios'
    ID = db.Column(db.Integer, primary_key=True)
    NombreUsuario = db.Column(db.String(50), unique=True, nullable=False)
    NombreCompleto = db.Column(db.String(100))
    Correo = db.Column(db.String(100), unique=True, nullable=False)
    Contraseña = db.Column(db.String(255), nullable=False)
    
class Sesion(db.Model):
    __tablename__ = 'sesiones'
    ID = db.Column(db.Integer, primary_key=True)
    Titulo = db.Column(db.String(100))
    Fecha = db.Column(db.DateTime, default=datetime.utcnow)
    Actividad = db.Column(db.Boolean, default=True)  # True para activa, False para inactiva
    UsuarioID = db.Column(db.Integer, db.ForeignKey('usuarios.ID'), nullable=False)
    mensajes = db.relationship('Mensaje', backref='sesion', lazy=True)

class Mensaje(db.Model):
    __tablename__ = 'mensajes'
    ID = db.Column(db.Integer, primary_key=True)
    MensajesUsuario = db.Column(db.Text, nullable=True)
    MensajesIA = db.Column(db.Text, nullable=True)
    Tiempo = db.Column(db.DateTime, default=datetime.utcnow)
    SesionID = db.Column(db.Integer, db.ForeignKey('sesiones.ID'), nullable=False)
    UsuarioID = db.Column(db.Integer, db.ForeignKey('usuarios.ID'), nullable=False)


# Aca se manejan todas las rutas
@app.route('/')
def inicio():
    return render_template('index.html')

# Ruta para solicitar restablecimiento de contraseña
@app.route('/solicitar_recuperacion', methods=['POST'])
def solicitar_recuperacion():
    email = request.form['email']
    usuario = Usuario.query.filter_by(Correo=email).first()
    
    if usuario:
        # Generar un token de recuperación y crear un enlace
        token = s.dumps(email, salt='recuperar-clave-salt')
        link = url_for('restablecer_contraseña', token=token, _external=True)
        
        # Enviar correo electrónico con el enlace de recuperación
        msg = Message('Recuperación de contraseña', sender='tu_correo@gmail.com', recipients=[email])
        msg.body = f'Haz clic en el siguiente enlace para restablecer tu contraseña: {link}'
        mail.send(msg)
        
        flash('Se ha enviado un enlace de recuperación a tu correo', 'info')
    else:
        flash('El correo no está registrado', 'danger')
    
    return redirect(url_for('inicio_sesion'))

# Ruta para el inicio de sesion
@app.route('/inicioSesion', methods=['GET', 'POST'])
def inicio_sesion():
    if request.method == 'POST':
        email = request.form['emailInput']
        password = request.form['password']

        # Verificación si el usuario ya está registrado o no
        usuario = Usuario.query.filter_by(Correo=email).first()
        if usuario and check_password_hash(usuario.Contraseña, password):
            session['usuario_id'] = usuario.ID  # Guarda el usuario ID en la sesión

            # Crear una nueva sesión de chat para este usuario
            titulo_sesion = "Nueva sesión de chat"  # Puedes personalizar el título
            nueva_sesion = Sesion(
                Titulo=titulo_sesion,
                Fecha=datetime.utcnow(),
                Actividad=True,
                UsuarioID=usuario.ID
            )
            db.session.add(nueva_sesion)
            db.session.commit()

            # Guardar el ID de la nueva sesión de chat en la sesión de Flask
            session['sesion_id'] = nueva_sesion.ID

            flash('Inicio de sesión exitoso', 'success')
            return redirect(url_for('chat_final'))  # Redirige a la pantalla final
        else:
            flash('Correo o contraseña incorrectos', 'danger')
    
    return render_template('inicioSesion.html')

# Ruta para el registro de nuevos usuarios
@app.route('/registrar', methods=['POST'])
def registrar():
    nombre_usuario = request.form['nombre_usuario'] 
    correo = request.form['email']
    contraseña = request.form['password'] 

    # Verifica si el usuario ya existe
    if Usuario.query.filter((Usuario.NombreUsuario == nombre_usuario) | (Usuario.Correo == correo)).first():
        flash('El usuario o correo ya existe', 'danger')
        return redirect(url_for('inicio_sesion'))

    # Crea un nuevo usuario
    nuevo_usuario = Usuario(
        NombreUsuario=nombre_usuario,
        Correo=correo,
        Contraseña=generate_password_hash(contraseña)
    )
    db.session.add(nuevo_usuario)
    db.session.commit()
    
    flash('Registro exitoso. Ahora puedes iniciar sesión.', 'success')
    return redirect(url_for('inicio_sesion'))

# Ruta para restablecer la contraseña
@app.route('/restablecer_contraseña/<token>', methods=['GET', 'POST'])
def restablecer_contraseña(token):
    try:
        email = s.loads(token, salt='recuperar-clave-salt', max_age=3600)  # Token válido por 1 hora
    except:
        flash('El enlace de recuperación ha expirado o es inválido', 'danger')
        return redirect(url_for('inicio_sesion'))

    if request.method == 'POST':
        nueva_contraseña = request.form['password']
        usuario = Usuario.query.filter_by(Correo=email).first()

        if usuario:
            usuario.Contraseña = generate_password_hash(nueva_contraseña)
            db.session.commit()
            flash('Contraseña actualizada con éxito', 'success')
            return redirect(url_for('inicio_sesion'))

    return render_template('restablecer_contraseña.html')

# Nueva ruta para manejar los mensajes del usuario y generar la respuesta con Ollama, para el modo de prueba nomas
@app.route('/send_message', methods=['POST'])
def send_message():
    user_message = request.form['message']

    # Agregar el mensaje del usuario al contexto histórico
    historical_context.append(f"Human: {user_message}")

    # Limitar el tamaño del contexto a los últimos 30 mensajes (sin eliminar las instrucciones iniciales)
    if len(historical_context) > 10:
        historical_context.pop(1)  # Eliminar el mensaje más antiguo (excepto las instrucciones iniciales)

    # Construir el contexto para el prompt, uniendo las instrucciones con el historial de mensajes
    full_prompt = "\n".join(historical_context) + "\nEdnaIA:"  # Aquí puedes mantener la referencia a EdnaIA o modificarla según prefieras

    # Generar la respuesta de la IA utilizando el modelo Ollama
    response = ""
    for chunk in ollama.generate(model='qwen2.5:0.5b', prompt=full_prompt, stream=True):
        chunk_text = chunk['response']
        response += chunk_text

    # Agregar la respuesta de la IA al contexto histórico
    historical_context.append(f"EdnaIA: {response}")

    # Devolver la respuesta al frontend
    return jsonify({'response': response})

# Ruta del chat final
@app.route('/send_message_final', methods=['POST'])
def send_message_final():
    user_message = request.form['message']

    # Obtener el usuario actual desde la sesión
    usuario_id = session.get('usuario_id')

    if not usuario_id:
        return jsonify({'error': 'Usuario no autenticado'}), 401

    # Obtener la sesión de chat actual desde la sesión de Flask
    sesion_id = session.get('sesion_id')

    if not sesion_id:
        return jsonify({'error': 'Sesión de chat no encontrada'}), 400

    # Recuperar la sesión de chat actual desde la base de datos usando Session.get()
    current_session = db.session.get(Sesion, sesion_id)

    # Si la sesión no existe, retornamos un error
    if not current_session:
        return jsonify({'error': 'Sesión de chat no válida'}), 400

    # Recuperar todo el historial de mensajes de la sesión actual desde la base de datos
    mensajes_sesion = Mensaje.query.filter_by(SesionID=current_session.ID).order_by(Mensaje.Tiempo.asc()).all()

    # Crear el contexto del chat concatenando todos los mensajes previos de la sesión
    contexto_chat = [instrucciones_finales]  # Incluir siempre las instrucciones finales
    for mensaje in mensajes_sesion:
        if mensaje.MensajesUsuario:
            contexto_chat.append(f"Human: {mensaje.MensajesUsuario}")
        if mensaje.MensajesIA:
            contexto_chat.append(f"EdnaIA: {mensaje.MensajesIA}")

    # Añadir el nuevo mensaje del usuario al contexto
    contexto_chat.append(f"Human: {user_message}")

    # Construir el contexto completo para el prompt
    full_prompt = "\n".join(contexto_chat) + "\nEdnaIA:"

    # Generar la respuesta de la IA utilizando el modelo Ollama
    response = ""
    for chunk in ollama.generate(model='gemma2:2b', prompt=full_prompt, stream=True):
        response += chunk['response']

    # Guardar los mensajes en la base de datos
    nuevo_mensaje = Mensaje(
        MensajesUsuario=user_message,
        MensajesIA=response,
        Tiempo=datetime.utcnow(),
        SesionID=current_session.ID,
        UsuarioID=usuario_id
    )
    db.session.add(nuevo_mensaje)
    db.session.commit()

    # Devolver la respuesta al frontend
    return jsonify({'response': response})

# Modificación en la ruta /crear_nueva_sesion
@app.route('/crear_nueva_sesion', methods=['POST'])
def crear_nueva_sesion():
    usuario_id = session.get('usuario_id')
    
    if not usuario_id:
        return jsonify({'error': 'Usuario no autenticado'}), 401
    
    # Crear una nueva sesión de chat con la fecha actual
    nueva_sesion = Sesion(
        Titulo=datetime.utcnow().strftime("%d/%m/%Y %H:%M"),  # Usar la fecha como título
        Fecha=datetime.utcnow(),
        Actividad=True,
        UsuarioID=usuario_id
    )
    
    db.session.add(nueva_sesion)
    db.session.commit()
    
    return jsonify({'session_id': nueva_sesion.ID})

# Modificación en la ruta /obtener_sesiones en app.py
@app.route('/obtener_sesiones', methods=['GET'])
def obtener_sesiones():
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        return jsonify({'error': 'Usuario no autenticado'}), 401
    
    sesiones = Sesion.query.filter_by(UsuarioID=usuario_id).order_by(Sesion.Fecha.desc()).all()
    sesiones_list = [{
        'id': sesion.ID, 
        'fecha': sesion.Fecha.strftime("%d/%m/%Y %H:%M")  # Formato día/mes/año hora:minuto
    } for sesion in sesiones]
    
    return jsonify(sesiones_list)

@app.route('/obtener_mensajes_sesion/<int:sesion_id>', methods=['GET'])
def obtener_mensajes_sesion(sesion_id):
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        return jsonify({'error': 'Usuario no autenticado'}), 401
    
    # Verificar que la sesión pertenece al usuario
    sesion = Sesion.query.filter_by(ID=sesion_id, UsuarioID=usuario_id).first()
    if not sesion:
        return jsonify({'error': 'Sesión no encontrada'}), 404
    
    # Obtener todos los mensajes de la sesión
    mensajes = Mensaje.query.filter_by(SesionID=sesion_id).order_by(Mensaje.Tiempo.asc()).all()
    
    # Formatear los mensajes para enviarlos al frontend
    mensajes_formateados = []
    for mensaje in mensajes:
        if mensaje.MensajesUsuario:
            mensajes_formateados.append({
                'sender': 'Tú',
                'message': mensaje.MensajesUsuario
            })
        if mensaje.MensajesIA:
            mensajes_formateados.append({
                'sender': 'EdnaIA',
                'message': mensaje.MensajesIA
            })
    
    return jsonify(mensajes_formateados)

# Modificar la ruta existente cargar_sesion para que retorne un JSON en lugar de redireccionar
@app.route('/cargar_sesion/<int:sesion_id>', methods=['GET'])
def cargar_sesion(sesion_id):
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        flash('Usuario no autenticado')
        return redirect(url_for('inicio_sesion'))  # Redirige al inicio si no está autenticado

    # Verifica si la sesión existe y pertenece al usuario actual
    sesion = Sesion.query.filter_by(ID=sesion_id, UsuarioID=usuario_id).first()
    if not sesion:
        flash('Sesión no encontrada')
        return redirect(url_for('chat_final'))  # Redirige a chatFinal si no existe la sesión

    # Guarda el ID de la sesión en la sesión de Flask y redirige a chatFinal
    session['sesion_id'] = sesion_id
    return redirect(url_for('chat_final'))


@app.route('/chatPrueba')
def chat_prueba():
    return render_template('chatPrueba.html')

@app.route('/chatFinal')
def chat_final():
    return render_template('chatFinal.html')

if __name__ == '__main__':
    app.run(debug=True)
