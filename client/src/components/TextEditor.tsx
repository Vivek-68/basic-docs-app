import Quill from "quill"
import "quill/dist/quill.snow.css"
import { useEffect, useRef, useState } from "react"
import {Socket, io} from "socket.io-client"

const TextEditor = () => {
    const [socket,setSocket] = useState<Socket | null>(null)
    const [quill,setQuill] = useState<Quill|null>(null) 
    const toolbarOptions= [
        [{ header: [1, 2, 3, 4,false] }],  
        ['bold', 'italic', 'underline', 'strike'],  
        [{ list: 'ordered' }, { list: 'bullet' }],  
        [{ indent: '-1' }, { indent: '+1' }], 
        [{ align: [] }], 
        ['blockquote', 'code-block'],  
        [{ color: [] }, { background: [] }], 
        [{ script: 'sub' }, { script: 'super' }], 
        ['clean'], 
      ];


    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        const s: Socket = io("http://localhost:3000");
        setSocket(s)

        return () => s.disconnect()
        
    },[])

    useEffect(()=>{
        if(containerRef.current){
        const editor:HTMLDivElement = document.createElement('div');
        containerRef.current.append(editor);
      const quill =  new Quill(editor,{
            theme:'snow',
            modules:{
                toolbar:toolbarOptions
            }
        })
        setQuill(quill);
        quill.on('text-change',(delta,oldContent,source) =>{
            if(source === 'user'){
                socket?.emit('send-delta',delta);
                console.log('sent')
            }
        })
    }
    
    return () =>{
        if(containerRef.current){
            containerRef.current.innerHTML =""
        }
        
    }     
    },[socket])

   useEffect(()=>{
    if(!quill || !socket){
        console.log('null val')
        return
    }
    
    socket.on('received-delta',(delta) => {
        quill.updateContents(delta,'silent');
        console.log(delta)
    })

    return () => socket.off('received-delta')
   },[socket,quill])
    
  return (
    
     <div ref={containerRef} className=" container w-[8.27in] h-[11.69in] m-auto "></div>
   
  )
}

export default TextEditor