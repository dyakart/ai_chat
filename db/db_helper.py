# ---------------------------------------#
# Module for working with the database.
# ---------------------------------------#
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Mapped, mapped_column
from ai_chat.core import settings as cfg

engine = create_engine(
    f"sqlite:///{cfg.DB_PATH}",
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


class ChatRequests(Base):
    __tablename__ = 'chat_requests'

    id: Mapped[int] = mapped_column(primary_key=True)
    ip_address: Mapped[str] = mapped_column(index=True)
    prompt: Mapped[str]
    response: Mapped[str]


def get_user_requests(ip_address: str) -> list[ChatRequests]:
    with SessionLocal() as new_session:
        query = select(ChatRequests).filter_by(ip_address=ip_address)
        result = new_session.execute(query)
        return result.scalars().all()


def add_request_data(ip_address: str, prompt: str, response: str) -> None:
    with SessionLocal() as new_session:
        new_request = ChatRequests(ip_address=ip_address, prompt=prompt, response=response)
        new_session.add(new_request)

        new_session.commit()
