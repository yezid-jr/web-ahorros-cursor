from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, func, extract
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
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
    objetivos = db.query(Objetivo).all()
    if not objetivos:
        # Crear objetivos iniciales si no existen
        objetivos_amounts = [1000000, 2000000, 3000000, 5000000, 7000000, 12000000, 20000000]
        for amount in objetivos_amounts:
            objetivo = Objetivo(amount=amount)
            db.add(objetivo)
        db.commit()
        objetivos = db.query(Objetivo).all()
    
    # Actualizar objetivos completados basado en el total
    total_general = db.query(Ahorro).with_entities(
        db.func.sum(Ahorro.amount)
    ).scalar() or 0.0
    
    for objetivo in objetivos:
        if total_general >= objetivo.amount and not objetivo.completed:
            objetivo.completed = True
            objetivo.completed_at = datetime.utcnow()
    
    db.commit()
    return db.query(Objetivo).all()

@app.get("/retos", response_model=List[RetoResponse])
def get_retos(db: Session = Depends(get_db)):
    return db.query(Reto).order_by(Reto.date.desc()).all()

@app.get("/retos/actual")
def get_reto_actual(db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    today = datetime.now()
    day = today.day
    
    # Retos se activan el día 1 y 15
    if day == 1 or day == 15:
        # Buscar reto para hoy
        reto = db.query(Reto).filter(
            db.func.date(Reto.date) == today.date()
        ).first()
        
        if not reto:
            return {"reto": None, "message": "No hay reto activo"}
        
        return {"reto": reto, "message": "Reto activo"}
    
    return {"reto": None, "message": "No es día 1 o 15"}

@app.post("/retos/crear")
def crear_reto(description: str = Query(..., description="Descripción del reto"), db: Session = Depends(get_db)):
    from datetime import datetime
    today = datetime.now()
    
    reto = Reto(
        description=description,
        date=today,
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
    reto = db.query(Reto).filter(Reto.id == reto_id).first()
    if not reto:
        raise HTTPException(status_code=404, detail="Reto not found")
    
    if user_id == 1:
        reto.completed_user1 = True
    elif user_id == 2:
        reto.completed_user2 = True
    
    db.commit()
    return {"message": "Reto completed"}

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
