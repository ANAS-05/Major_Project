"""
Chat Router for JourneyIt
=========================
Provides the /chat endpoint and conversation history APIs.
"""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models_sqlite import User, ChatMessage as ChatMessageModel
from auth import get_current_user, get_current_active_user
from services.chatbot import process_message

router = APIRouter(prefix="/chat", tags=["Chatbot"])


# ─────────────────────────────────────────────────
# REQUEST / RESPONSE SCHEMAS
# ─────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    reply: str
    data: Optional[dict] = None
    conversation_id: Optional[str] = None


class ChatHistoryRequest(BaseModel):
    limit: int = Field(20, ge=1, le=100)


# ─────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────

@router.post("", response_model=ChatResponse)
def chat(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Send a message to JourneyIt AI chatbot.

    Requires authentication. Saves the conversation to history.
    """
    result = process_message(req.message)

    # Save user message
    user_msg = ChatMessageModel(
        user_id=current_user.user_id,
        role="user",
        content=req.message,
    )
    db.add(user_msg)

    # Save bot response
    bot_msg = ChatMessageModel(
        user_id=current_user.user_id,
        role="assistant",
        content=result["reply"],
        intent=getattr(result.get("data"), "intent", None) or "general",
    )
    db.add(bot_msg)
    db.commit()

    return ChatResponse(
        reply=result["reply"],
        data=result["data"],
        conversation_id=user_msg.conversation_id,
    )


@router.post("/guest", response_model=ChatResponse)
def chat_guest(req: ChatRequest):
    """
    Send a message to JourneyIt AI chatbot WITHOUT authentication.

    Use this for anonymous/guest access. Conversation is NOT saved.
    """
    result = process_message(req.message)
    return ChatResponse(reply=result["reply"], data=result["data"])


@router.get("/history", response_model=list)
def get_chat_history(
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the authenticated user's chat history."""
    messages = (
        db.query(ChatMessageModel)
        .filter(ChatMessageModel.user_id == current_user.user_id)
        .order_by(ChatMessageModel.created_at.desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": msg.message_id,
            "role": msg.role,
            "content": msg.content,
            "intent": msg.intent,
            "created_at": str(msg.created_at) if msg.created_at else None,
        }
        for msg in reversed(messages)  # Chronological order
    ]


@router.delete("/history", status_code=status.HTTP_200_OK)
def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete all chat history for the authenticated user."""
    deleted = (
        db.query(ChatMessageModel)
        .filter(ChatMessageModel.user_id == current_user.user_id)
        .delete()
    )
    db.commit()
    return {"message": f"Deleted {deleted} messages", "deleted_count": deleted}