import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { interval, Observable, of } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  private apiKey = 'sk-...';
  private baseUrl = 'https://api.openai.com/v1';
  private assistantId = 'asst_abc123def456';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.apiKey}`,
    'OpenAI-Beta': 'assistants=v1'
  });

  constructor(private http: HttpClient) { }

  // Crea un nuovo thread
  createThread(): Observable<any> {
    return this.http.post(`${this.baseUrl}/threads`, {}, { headers: this.headers });
  }

  //Aggiungi un messaggio al thread
  addMessageToThread(threadId: string, userMessage: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/threads/${threadId}/messages`,
      { role: 'user', content: userMessage },
      { headers: this.headers }
    );
  }

  //Avvia la run
  createRun(threadId: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/threads/${threadId}/runs`,
      { assistant_id: this.assistantId },
      { headers: this.headers }
    );
  }

  //Polling per attendere il completamento
  waitForRunCompletion(threadId: string, runId: string): Observable<any> {
    return interval(1000).pipe(
      switchMap(() => this.http.get(`${this.baseUrl}/threads/${threadId}/runs/${runId}`, { headers: this.headers })),
      takeWhile((run: any) => run.status !== 'completed', true)
    );
  }

  //Recupera la risposta del bot
  getMessages(threadId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/threads/${threadId}/messages`, { headers: this.headers });
  }

  //Metodo completo: tutto il flusso dall'input alla risposta
  askAssistant(userMessage: string): Observable<string> {
    let threadId: string;

    return this.createThread().pipe(
      switchMap((thread: any) => {
        threadId = thread.id;
        return this.addMessageToThread(threadId, userMessage);
      }),
      switchMap(() => this.createRun(threadId)),
      switchMap((run: any) => this.waitForRunCompletion(threadId, run.id)),
      switchMap(() => this.getMessages(threadId)),
      // Prendiamo l'ultimo messaggio dell'assistente
      switchMap((res: any) => {
        const messages = res.data;
        const lastAssistantMessage = messages.find((msg: any) => msg.role === 'assistant');
        return [lastAssistantMessage?.content[0]?.text?.value || 'Nessuna risposta.'];
      })
    );
  }

  // Simulazione: risposta cablata
  getFakeAssistantResponse(prompt: string): Observable<string> {
    const simulatedResponse = `
🟨 Titolo: Introduction to Programming in Java  
Docente: Prof. Mario Viola  
Durata: 4 settimane  

**Struttura del corso**:  
- 2 lezioni a settimana (1 ora ciascuna)  
- 2 laboratori assistiti a settimana (1 ora ciascuno)  

🎯 Obiettivi del corso  
- Introdurre i fondamenti della programmazione usando Java  
- Imparare a scrivere software di qualità che risolve problemi reali  
- Acquisire dimestichezza con strumenti di sviluppo professionali (IDE, compilatori, ecc.)  

🧱 Contenuti principali  
- Installazione e configurazione dell’ambiente di sviluppo (JDK + Eclipse)  
- Uso di editor di codice (come Eclipse, ma anche opzioni più leggere)  
- Concetti base del linguaggio Java: variabili, strutture di controllo, funzioni, classi, oggetti  
- Debugging e gestione degli errori  
- Lavoro pratico in laboratorio  

💻 Strumenti consigliati  
- JDK, Eclipse, SciTE, jEdit, TextWrangler  

🔍 A chi è rivolto?  
- Principianti o chi ha poca esperienza  
- Chi vuole imparare Java in modo pratico  

🧑‍🏫 Metodo di insegnamento  
- Lezioni frontali  
- Laboratori pratici  

📦 Bonus  
- Ottima base per corsi avanzati  
- Insegna a scrivere codice robusto e manutenibile  
`;
    return of(simulatedResponse.trim());
  }
}
