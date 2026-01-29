from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, extract, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
from datetime import datetime, timedelta
from sqlalchemy import and_, or_, func
from random import choice
import os


# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./ahorro.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    color = Column(String)  # "person1" or "person2"

class Monto(Base):
    __tablename__ = "montos"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    user_id = Column(Integer)
    selected = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Ahorro(Base):
    __tablename__ = "ahorros"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    monto_id = Column(Integer)
    amount = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)

class Objetivo(Base):
    __tablename__ = "objetivos"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

class Reto(Base):
    __tablename__ = "retos"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    date = Column(DateTime)
    completed_user1 = Column(Boolean, default=False)
    completed_user2 = Column(Boolean, default=False)
    penitencia_applied = Column(Boolean, default=False)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class UserCreate(BaseModel):
    name: str
    color: str

class UserResponse(BaseModel):
    id: int
    name: str
    color: str

class MontoCreate(BaseModel):
    amount: float
    user_id: int

class MontoResponse(BaseModel):
    id: int
    amount: float
    user_id: int
    selected: bool

class AhorroCreate(BaseModel):
    user_id: int
    monto_id: int
    amount: float

class AhorroResponse(BaseModel):
    id: int
    user_id: int
    monto_id: int
    amount: float
    date: datetime

class ObjetivoResponse(BaseModel):
    id: int
    amount: float
    completed: bool
    completed_at: Optional[datetime]

class RetoResponse(BaseModel):
    id: int
    description: str
    date: datetime
    completed_user1: bool
    completed_user2: bool
    penitencia_applied: bool

class EstadisticasResponse(BaseModel):
    total_mes: float
    faltante_mes: float
    total_general: float
    objetivo_actual: float
    progreso_porcentaje: float

class Penitencia(Base):
    __tablename__ = "penitencias"
    
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)

# FastAPI app
app = FastAPI(title="Ahorro 2026 API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoints
@app.get("/")
def read_root():
    return {"message": "Ahorro 2026 API"}

@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(name=user.name, color=user.color)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.post("/montos", response_model=MontoResponse)
def create_monto(monto: MontoCreate, db: Session = Depends(get_db)):
    db_monto = Monto(amount=monto.amount, user_id=monto.user_id)
    db.add(db_monto)
    db.commit()
    db.refresh(db_monto)
    return db_monto

@app.get("/montos", response_model=List[MontoResponse])
def get_montos(db: Session = Depends(get_db)):
    return db.query(Monto).all()

@app.put("/montos/{monto_id}/select")
def select_monto(monto_id: int, user_id: int = Query(...), db: Session = Depends(get_db)):
    monto = db.query(Monto).filter(Monto.id == monto_id).first()
    if not monto:
        raise HTTPException(status_code=404, detail="Monto not found")
    
    # Marcar como seleccionado
    monto.selected = True
    db.commit()
    
    return {"message": "Monto selected"}

@app.post("/ahorros", response_model=AhorroResponse)
def create_ahorro(ahorro: AhorroCreate, db: Session = Depends(get_db)):
    db_ahorro = Ahorro(
        user_id=ahorro.user_id,
        monto_id=ahorro.monto_id,
        amount=ahorro.amount
    )
    db.add(db_ahorro)
    db.commit()
    db.refresh(db_ahorro)
    return db_ahorro

@app.get("/ahorros", response_model=List[AhorroResponse])
def get_ahorros(db: Session = Depends(get_db)):
    return db.query(Ahorro).all()
# Agrega este endpoint temporal para debug
@app.get("/debug/ahorros")
def debug_ahorros(db: Session = Depends(get_db)):
    ahorros = db.query(Ahorro).all()
    return {
        "count": len(ahorros),
        "ahorros": [{"id": a.id, "amount": a.amount, "date": str(a.date)} for a in ahorros]
    }

@app.post("/test/add-ahorro")
def test_add_ahorro(db: Session = Depends(get_db)):
    # Crear un ahorro de prueba
    ahorro = Ahorro(
        user_id=1,
        monto_id=1,
        amount=500000.0,
        date=datetime.now()
    )
    db.add(ahorro)
    db.commit()
    return {"message": "Ahorro de prueba creado", "amount": 500000.0}

@app.get("/estadisticas", response_model=EstadisticasResponse)
def get_estadisticas(db: Session = Depends(get_db)):
    # Total general
    total_general_result = db.query(func.sum(Ahorro.amount)).scalar()
    total_general = float(total_general_result) if total_general_result is not None else 0.0
    
    # Total del mes actual - ARREGLADO para SQLite
    now = datetime.now()
    primer_dia_mes = datetime(now.year, now.month, 1)
    
    # Calcular el último día del mes
    if now.month == 12:
        ultimo_dia_mes = datetime(now.year + 1, 1, 1)
    else:
        ultimo_dia_mes = datetime(now.year, now.month + 1, 1)
    
    total_mes_result = db.query(func.sum(Ahorro.amount)).filter(
        Ahorro.date >= primer_dia_mes,
        Ahorro.date < ultimo_dia_mes
    ).scalar()
    total_mes = float(total_mes_result) if total_mes_result is not None else 0.0
    
    # Objetivo del mes
    objetivo_mes = 2000000.0
    faltante_mes = max(0.0, objetivo_mes - total_mes)
    
    # Objetivo actual basado en el total general
    objetivos = [1000000, 2000000, 3000000, 5000000, 7000000, 12000000, 20000000]
    objetivo_actual = 20000000.0
    for obj in objetivos:
        if total_general < obj:
            objetivo_actual = float(obj)
            break
    
    progreso_porcentaje = (total_general / objetivo_actual * 100) if objetivo_actual > 0 else 0.0
    
    return EstadisticasResponse(
        total_mes=total_mes,
        faltante_mes=faltante_mes,
        total_general=total_general,
        objetivo_actual=objetivo_actual,
        progreso_porcentaje=progreso_porcentaje
    )

@app.get("/objetivos", response_model=List[ObjetivoResponse])
def get_objetivos(db: Session = Depends(get_db)):

    # 1️⃣ Obtener objetivos existentes
    objetivos = db.query(Objetivo).all()

    # 2️⃣ Si no existen, crearlos
    if not objetivos:
        objetivos_amounts = [
            1_000_000,
            2_000_000,
            3_000_000,
            5_000_000,
            7_000_000,
            12_000_000,
            20_000_000
        ]

        for amount in objetivos_amounts:
            db.add(Objetivo(amount=amount))

        db.commit()
        objetivos = db.query(Objetivo).all()

    # 3️⃣ Calcular total ahorrado
    total_general = db.query(func.sum(Ahorro.amount)).scalar() or 0

    # 4️⃣ Marcar objetivos completados
    for objetivo in objetivos:
        if total_general >= objetivo.amount and not objetivo.completed:
            objetivo.completed = True
            objetivo.completed_at = datetime.utcnow()

    db.commit()

    return objetivos

@app.get("/retos", response_model=List[RetoResponse])
def get_retos(db: Session = Depends(get_db)):
    """Obtener historial de retos COMPLETADOS o EXPIRADOS (solo los que fueron activados y ya terminaron)"""
    now = datetime.now()
    
    # Obtener retos que:
    # 1. Tienen fecha asignada (fueron activados)
    # 2. Y que ya NO son el reto actual (pasaron más de 24 horas O fueron completados por ambos)
    retos_historial = db.query(Reto).filter(
        and_(
            Reto.date.isnot(None),  # Fueron activados
            or_(
                Reto.date < now - timedelta(hours=24),  # Ya pasaron 24 horas
                and_(  # O ambos completaron
                    Reto.completed_user1 == True,
                    Reto.completed_user2 == True
                )
            )
        )
    ).order_by(Reto.date.desc()).all()
    
    return retos_historial

@app.get("/retos/actual")
def get_reto_actual(db: Session = Depends(get_db)):
    """Obtener el reto activo actual (si existe)"""
    now = datetime.now()
    
    # Buscar reto activo: creado hace menos de 24 horas y no completado por ambos
    reto = db.query(Reto).filter(
        and_(
            Reto.date.isnot(None),  # Tiene fecha asignada
            Reto.date >= now - timedelta(hours=24),  # Creado hace menos de 24 horas
            or_(
                Reto.completed_user1 == False,
                Reto.completed_user2 == False
            )
        )
    ).order_by(Reto.date.desc()).first()
    
    if reto:
        return {"reto": reto}
    
    return {"reto": None}

@app.get("/retos/disponibles")
def get_retos_disponibles(db: Session = Depends(get_db)):
    """Obtener retos que aún no han sido usados"""
    # Obtener IDs de retos ya usados (que tienen fecha)
    retos_usados_ids = db.query(Reto.id).filter(Reto.date.isnot(None)).all()
    retos_usados_ids = [r[0] for r in retos_usados_ids]
    
    # Obtener retos disponibles (sin fecha)
    retos_disponibles = db.query(Reto).filter(
        and_(
            Reto.date.is_(None),
            ~Reto.id.in_(retos_usados_ids) if retos_usados_ids else True
        )
    ).all()
    
    return {"retos_disponibles": retos_disponibles, "total": len(retos_disponibles)}

@app.post("/retos/activar")
def activar_reto_aleatorio(db: Session = Depends(get_db)):
    """Activar un reto aleatorio (asignarle fecha actual)"""
    now = datetime.now()
    
    # Verificar si ya existe un reto activo
    reto_activo = db.query(Reto).filter(
        and_(
            Reto.date.isnot(None),
            Reto.date >= now - timedelta(hours=24)
        )
    ).first()
    
    if reto_activo:
        return {"message": "Ya existe un reto activo", "reto": reto_activo}
    
    # Obtener retos disponibles (sin fecha asignada)
    retos_disponibles = db.query(Reto).filter(Reto.date.is_(None)).all()
    
    if not retos_disponibles:
        raise HTTPException(status_code=404, detail="No hay retos disponibles")
    
    # Seleccionar uno aleatorio
    reto_seleccionado = choice(retos_disponibles)
    
    # Activarlo asignándole la fecha actual
    reto_seleccionado.date = now
    reto_seleccionado.completed_user1 = False
    reto_seleccionado.completed_user2 = False
    reto_seleccionado.penitencia_applied = False
    
    db.commit()
    db.refresh(reto_seleccionado)
    
    return {"message": "Reto activado", "reto": reto_seleccionado}

@app.post("/retos/crear")
def crear_reto(description: str = Query(...), tipo: str = Query("ahorro"), db: Session = Depends(get_db)):
    """Crear un nuevo reto en el pool (sin fecha asignada)"""
    reto = Reto(
        description=description,
        tipo=tipo,
        date=None,  # Sin fecha = disponible para usar
        completed_user1=False,
        completed_user2=False,
        penitencia_applied=False
    )
    db.add(reto)
    db.commit()
    db.refresh(reto)
    return reto

@app.post("/retos/{reto_id}/complete")
def complete_reto(reto_id: int, user_id: int = Query(...), db: Session = Depends(get_db)):
    """Marcar reto como completado por un usuario"""
    reto = db.query(Reto).filter(Reto.id == reto_id).first()
    if not reto:
        raise HTTPException(status_code=404, detail="Reto not found")
    
    # Verificar que el reto no haya expirado (24 horas)
    if reto.date:
        tiempo_limite = reto.date + timedelta(hours=24)
        if datetime.now() > tiempo_limite:
            raise HTTPException(status_code=400, detail="El reto ha expirado")
    
    if user_id == 1:
        reto.completed_user1 = True
    elif user_id == 2:
        reto.completed_user2 = True
    else:
        raise HTTPException(status_code=400, detail="Usuario inválido")
    
    db.commit()
    db.refresh(reto)
    
    return {
        "message": "Reto completado",
        "reto": reto,
        "ambos_completados": reto.completed_user1 and reto.completed_user2
    }

@app.post("/retos/{reto_id}/aplicar-penitencia")
def aplicar_penitencia(reto_id: int, db: Session = Depends(get_db)):
    """Marcar que se aplicó penitencia al reto"""
    reto = db.query(Reto).filter(Reto.id == reto_id).first()
    if not reto:
        raise HTTPException(status_code=404, detail="Reto not found")
    
    reto.penitencia_applied = True
    db.commit()
    
    return {"message": "Penitencia aplicada"}

@app.get("/penitencias")
def get_penitencias(db: Session = Depends(get_db)):
    """Obtener todas las penitencias disponibles"""
    penitencias = db.query(Penitencia).all()
    return {"penitencias": [p.description for p in penitencias]}

@app.get("/penitencias/random")
def get_penitencia_aleatoria(db: Session = Depends(get_db)):
    """Obtener una penitencia aleatoria"""
    penitencias = db.query(Penitencia).all()
    if not penitencias:
        raise HTTPException(status_code=404, detail="No hay penitencias disponibles")
    
    penitencia = choice(penitencias)
    return {"penitencia": penitencia.description}

@app.post("/init")
def init_db(db: Session = Depends(get_db)):
    # Crear usuarios si no existen
    user1 = db.query(User).filter(User.id == 1).first()
    if not user1:
        user1 = User(name="Persona 1", color="person1")
        db.add(user1)
    
    user2 = db.query(User).filter(User.id == 2).first()
    if not user2:
        user2 = User(name="Persona 2", color="person2")
        db.add(user2)
    
    # Crear objetivos si no existen
    objetivos = db.query(Objetivo).all()
    if not objetivos:
        objetivos_amounts = [1000000, 2000000, 3000000, 5000000, 7000000, 12000000, 20000000]
        for amount in objetivos_amounts:
            objetivo = Objetivo(amount=amount)
            db.add(objetivo)
    
    db.commit()
    return {"message": "Database initialized"}
