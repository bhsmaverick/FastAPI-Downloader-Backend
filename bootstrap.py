import os
import json

app_dir = 'fastapi_app'
locales_dir = os.path.join(app_dir, 'locales')
os.makedirs(locales_dir, exist_ok=True)
open(os.path.join(app_dir, '__init__.py'), 'w').close()

locales = {
  "en": {"task_started": "Task started", "error_enqueuing": "Error enqueuing task", "task_not_found": "Task not found", "status_msg": "Status retrieved", "queued": "Task is queued", "processing": "Processing", "downloading": "Downloading", "finalizing": "Finalizing", "completed": "Completed", "error_processing": "Processing error"},
  "es": {"task_started": "Tarea iniciada", "error_enqueuing": "Error en la cola", "task_not_found": "Tarea no encontrada", "status_msg": "Estado obtenido", "queued": "Tarea en cola", "processing": "Procesando", "downloading": "Descargando", "finalizing": "Finalizando", "completed": "Completado", "error_processing": "Error de procesamiento"},
  "pt": {"task_started": "Tarefa iniciada", "error_enqueuing": "Erro na fila", "task_not_found": "Tarefa não encontrada", "status_msg": "Status obtido", "queued": "Tarefa na fila", "processing": "Processando", "downloading": "Baixando", "finalizing": "Finalizando", "completed": "Concluído", "error_processing": "Erro de processamento"},
  "de": {"task_started": "Aufgabe gestartet", "error_enqueuing": "Fehler beim Einreihen", "task_not_found": "Aufgabe nicht gefunden", "status_msg": "Status abgerufen", "queued": "Aufgabe in Warteschlange", "processing": "Verarbeitung", "downloading": "Herunterladen", "finalizing": "Abschließen", "completed": "Abgeschlossen", "error_processing": "Verarbeitungsfehler"},
  "fr": {"task_started": "Tâche démarrée", "error_enqueuing": "Erreur de file d'attente", "task_not_found": "Tâche introuvable", "status_msg": "Statut récupéré", "queued": "Tâche en file d'attente", "processing": "Traitement", "downloading": "Téléchargement", "finalizing": "Finalisation", "completed": "Terminé", "error_processing": "Erreur de traitement"},
  "ua": {"task_started": "Завдання розпочато", "error_enqueuing": "Помилка черги", "task_not_found": "Завдання не знайдено", "status_msg": "Статус отримано", "queued": "Завдання в черзі", "processing": "Обробка", "downloading": "Завантаження", "finalizing": "Завершення", "completed": "Завершено", "error_processing": "Помилка обробки"},
  "pl": {"task_started": "Zadanie rozpoczęte", "error_enqueuing": "Błąd kolejkowania", "task_not_found": "Zadanie nie znalezione", "status_msg": "Status pobrany", "queued": "Zadanie w kolejce", "processing": "Przetwarzanie", "downloading": "Pobieranie", "finalizing": "Zakończenie", "completed": "Zakończone", "error_processing": "Błąd przetwarzania"},
  "ja": {"task_started": "タスク開始", "error_enqueuing": "キューエラー", "task_not_found": "タスクが見つかりません", "status_msg": "ステータス取得済み", "queued": "キューに入ったタスク", "processing": "処理中", "downloading": "ダウンロード中", "finalizing": "終了中", "completed": "完了", "error_processing": "処理エラー"},
  "ar": {"task_started": "بدأت المهمة", "error_enqueuing": "خطأ في قائمة الانتظار", "task_not_found": "المهمة غير موجودة", "status_msg": "الحالة المسترجعة", "queued": "مهمة في قائمة الانتظار", "processing": "جاري المعالجة", "downloading": "تنزيل", "finalizing": "الانتهاء", "completed": "منجز", "error_processing": "خطأ في المعالجة"},
  "tr": {"task_started": "Görev başlatıldı", "error_enqueuing": "Sıraya ekleme hatası", "task_not_found": "Görev bulunamadı", "status_msg": "Durum alındı", "queued": "Görev kuyrukta", "processing": "İşleniyor", "downloading": "İndiriliyor", "finalizing": "Sonuçlandırılıyor", "completed": "Tamamlandı", "error_processing": "İşleme hatası"},
  "hi": {"task_started": "कार्य शुरू", "error_enqueuing": "कतार त्रुटि", "task_not_found": "कार्य नहीं मिला", "status_msg": "स्थिति प्राप्त", "queued": "कार्य कतार में है", "processing": "प्रसंस्करण", "downloading": "डाउनलोड कर रहा है", "finalizing": "अंतिम रूप दे रहा है", "completed": "पूर्ण", "error_processing": "प्रसंस्करण त्रुटि"},
  "it": {"task_started": "Attività avviata", "error_enqueuing": "Errore accodamento", "task_not_found": "Attività non trovata", "status_msg": "Stato recuperato", "queued": "Attività in coda", "processing": "In elaborazione", "downloading": "Download", "finalizing": "Finalizzando", "completed": "Completato", "error_processing": "Errore elaborazione"},
  "ko": {"task_started": "작업 시작됨", "error_enqueuing": "대기열 오류", "task_not_found": "작업을 찾을 수 없음", "status_msg": "가져온 상태", "queued": "작업 대기 중", "processing": "처리 중", "downloading": "다운로드 중", "finalizing": "마무리", "completed": "완료됨", "error_processing": "처리 오류"},
  "id": {"task_started": "Tugas dimulai", "error_enqueuing": "Kesalahan antrean", "task_not_found": "Tugas tidak ditemukan", "status_msg": "Status diambil", "queued": "Tugas dalam antrean", "processing": "Memproses", "downloading": "Mengunduh", "finalizing": "Menyelesaikan", "completed": "Selesai", "error_processing": "Kesalahan pemrosesan"}
}

for lang, messages in locales.items():
    with open(os.path.join(locales_dir, f"{lang}.json"), 'w', encoding='utf-8') as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)

print("Locales baked successfully")
