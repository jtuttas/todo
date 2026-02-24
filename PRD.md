# Project Requirements Document

Die Anwendung sollte es ermöglichen, Mitarbeitern diverse Aufgaben (To-dos) zuzuordnen und diese mit Prioritäten zu versehen. Die Aufgaben sind unterschiedlichen Projekten zugewiesen. Der Zugriff der ToDo-App soll per Desktop-PC sowie via Tablet und Smartphone möglich sein (responsive Design). Die Benutzerschnittstelle soll keine komplexen Grafiken enthalten und effizient / dynamisch geladen werden. Es ist nicht geplant eine Mehrsprachigkeit anzubieten. Ebenso ist der Grad der Barrierefreiheit als gering zu bewerten. Die Anwendung soll schnell auf Benutzereingaben reagieren und intuitiv zu bedienen sein.

Meldet sich ein Mitarbeiter an dem System an (sofern er nicht schon angemeldet war), so sieht er eine Liste der zu bearbeitenden Aufgaben. Über eine Detailanzeige kann er hierbei erkennen, zu welchem Projekt die Aufgabe gehört, welche Priorität sie hat. Er hat ferner die Möglichkeit, die Aufgabe als erledigt zu markieren und nach Projekten und Prioritäten zu sortieren.

Abteilungsleiter sind auch Mitarbeiter. Wenn sich ein Abteilungsleiter am System anmeldet, so hat er darüber hinaus die Möglichkeit, die Aufgaben seiner Mitarbeiter zu sehen, sowie neue Aufgabe zu erstellen, diesen Mitarbeitern zuzuweisen und die Aufgaben diversen Prioritäten sowie Projekten zuzuordnen. Ferner verfügt er über die Berechtigung, neue Projekte anzulegen.

Der Administrator des Systems kann Benutzerkonten anlegen und für diese Rollen vergeben und ändern. Das Backend steht in Form einer REST-API zur Verfügung. In diesem Lernfeld soll für diese Anwendung ein Frontend entwickelt werden.

## Funktionale Anforderungen
- Mitarbeiter können sich anmelden und ihre To-dos sehen.
- Mitarbeiter können To-dos als erledigt markieren. 
- Mitarbeiter können To-dos nach Projekten und Prioritäten sortieren.
- Abteilungsleiter können die To-dos ihrer Mitarbeiter sehen.
- Abteilungsleiter können neue To-dos erstellen, diese Mitarbeitern zuweisen und Prioritäten sowie Projekte zuordnen.
- Abteilungsleiter können neue Projekte anlegen.
- Administratoren können Benutzerkonten anlegen und Rollen vergeben.
- Das Backend stellt eine REST-API zur Verfügung.

## Nicht-funktionale Anforderungen

- Die Anwendung soll responsive sein und auf Desktop-PCs, Tablets und Smartphones funktionieren.
- Die Benutzerschnittstelle soll effizient und dynamisch geladen werden.
- Es soll keine komplexen Grafiken enthalten.
- Die Anwendung soll schnell auf Benutzereingaben reagieren und intuitiv zu bedienen sein.
