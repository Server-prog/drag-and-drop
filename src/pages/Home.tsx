// src/pages/Home.tsx
import {
    DndContext,
    closestCenter,
    DragEndEvent,
  } from '@dnd-kit/core';
  import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy,
  } from '@dnd-kit/sortable';
  import { CSS } from '@dnd-kit/utilities';
  import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
  import { useState } from 'react';
  
  import {
    CheckCircle,
    Trash2,
    Eye,
  } from 'lucide-react';
  
  type Notification = {
    id: string;
    text: string;
    read: boolean;
    expanded: boolean;
  };
  
  const initialNotifications: Notification[] = [
    { id: '1', text: 'Nova mensagem de João', read: false, expanded: false },
    { id: '2', text: 'Atualização do sistema disponível', read: false, expanded: false },
    { id: '3', text: 'Alerta de segurança: login suspeito', read: false, expanded: false },
    { id: '4', text: 'Evento amanhã às 10h', read: false, expanded: false },
    { id: '5', text: 'Comentário novo na sua publicação', read: false, expanded: false },
    { id: '6', text: 'Seu pedido foi enviado', read: false, expanded: false },
    { id: '7', text: 'Backup realizado com sucesso', read: false, expanded: false },
    { id: '8', text: 'Nova conexão no LinkedIn', read: false, expanded: false },
    { id: '9', text: 'Lembrete de pagamento', read: false, expanded: false },
    { id: '10', text: 'Falha ao sincronizar seus arquivos', read: false, expanded: false },
    { id: '11', text: 'Atualização de política de privacidade', read: false, expanded: false },
    { id: '12', text: 'Solicitação de amizade recebida', read: false, expanded: false },
    { id: '13', text: 'Nova tarefa atribuída a você', read: false, expanded: false },
  ];
  
  export default function Home() {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = notifications.findIndex((item) => item.id === active.id);
        const newIndex = notifications.findIndex((item) => item.id === over?.id);
        setNotifications(arrayMove(notifications, oldIndex, newIndex));
      }
    };
  
    const markAsRead = (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    };
  
    const deleteNotification = (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };
  
    const toggleExpand = (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, expanded: !n.expanded } : n))
      );
    };
  
    return (
      <div className="flex items-center justify-center h-screen h-full">
        <div className="w-[420px] h-[600px] bg-white shadow-xl rounded-lg p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Notificações</h2>
  
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={notifications.map((n) => n.id)} strategy={verticalListSortingStrategy}>
              {notifications.map((n) => (
                <SortableNotification
                  key={n.id}
                  {...n}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onToggleExpand={toggleExpand}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    );
  }
  
  function SortableNotification({
    id,
    text,
    read,
    expanded,
    onMarkAsRead,
    onDelete,
    onToggleExpand,
  }: Notification & {
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleExpand: (id: string) => void;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={`mb-2 p-4 rounded-lg shadow-sm cursor-move transition-all ${
          read ? 'bg-gray-200 text-gray-500' : 'bg-slate-100 hover:bg-slate-200'
        }`}
      >
        <div className="flex justify-between items-start">
          <p className="font-medium text-sm">{text}</p>
          <div className="flex gap-2 text-gray-600">
            <button onClick={() => onMarkAsRead(id)} title="Marcar como lida">
              <CheckCircle size={18} />
            </button>
            <button onClick={() => onDelete(id)} title="Deletar">
              <Trash2 size={18} />
            </button>
            <button onClick={() => onToggleExpand(id)} title="Ver detalhes">
              <Eye size={18} />
            </button>
          </div>
        </div>
        {expanded && (
          <p className="text-xs mt-2 text-gray-600">
            Aqui você pode ver mais detalhes sobre essa notificação.
          </p>
        )}
      </div>
    );
  }
  