import { Bold, Eraser, Italic, Underline } from "lucide-react";
import styles from "./EmailEditor.module.scss";
import { useRef, useState } from "react";
import { Tstyle, applyStyle } from "./apply-style";
import parse from "html-react-parser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailService } from "../../services/email-service";

export function EmailEditor() {
  const [text, setText] =
    useState('Enter email...');

  const textRef = useRef<HTMLTextAreaElement | null>(null);

  const queryClient = useQueryClient()

  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  
  const updateSelection = () => {
    if (!textRef.current) return;
    setSelectionStart(textRef.current.selectionStart);
    setSelectionEnd(textRef.current.selectionEnd);
  };

  const applyFormat = (type: Tstyle) => {
    const selectedText = text.substring(selectionStart, selectionEnd); // Выеделенный текст

    if (!selectedText) return;

    const before = text.substring(0, selectionStart); // Текс до выделенного фрагмента

    const after = text.substring(selectionEnd); // Текст после выделенного фрагмента

    setText(before + applyStyle(type, selectedText) + after);
  };

  const {mutate, isPending} = useMutation({
    mutationKey: ["create email"],
    mutationFn: () => emailService.sendEmails(text),
    onSuccess() {
      setText('')
      queryClient.refetchQueries({queryKey: ["email list"]})
    } 
  });

  return (
    <div>
      <h1>Email Editor</h1>
      {text && <div className={styles.preview}>{parse(text)}</div>}
      <div className={styles.card}>
        <textarea
          ref={textRef}
          onSelect={updateSelection}
          className={styles.editor}
          spellCheck="false"
          value={text}
          onChange={(e) => setText(e.target.value)}
        >
          {text}
        </textarea>
        <div className={styles.actions}>
          <div className={styles.tools}>
            <button onClick={() => setText("")}>
              <Eraser size={17} />
            </button>
            <button onClick={() => applyFormat("bold")}>
              <Bold size={17} />
            </button>
            <button onClick={() => applyFormat("italic")}>
              <Italic size={17} />
            </button>
            <button onClick={() => applyFormat("underline")}>
              <Underline size={17} />
            </button>
          </div>
          <button onClick={() => mutate()} disabled={isPending}>Send now</button>
        </div>
      </div>
    </div>
  );
}
