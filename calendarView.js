
document.addEventListener('DOMContentLoaded', async() => {
const events = await axios.get('http://localhost:8000/events');
const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: { 
    center: 'dayGridMonth,timeGridDay,timeGridWeek',
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'}, // buttons for switching between views
    views: {
        dayGridMonth: { // name of view
        titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
        // other view-specific options here
        }
    },
    firstDay: 1,
    locale: 'fr',
    themeSystem: 'bootstrap',
    selectable: true,
    dateClick: function(info) {
        console.log(info);
        if(info.allDay){
            calendar.changeView('timeGridDay',info.date);

        }
        if(!info.allDay && info){
            
            const headers = {
                "Content-Type": "application/json"
                }
            const body = {
                date : info.dateStr						
            }
            console.log(info.view.getCurrentData())
            const event = 
            {
                title : "Recording",
                id: info.dateStr,
                start:  info.dateStr,
            }
            calendar.addEvent(event)			
            axios.post('http://localhost:8000/events',event,headers)
            .then((response)=>{
                if(response.data.isDelete){
                    const eventDelete = calendar.getEventById(dateId)
                    eventDelete.remove(info.dateStr)
                }
            })
            axios.post('http://localhost:8000/task',body,headers);
        }
    },
    
    eventClick: function (info){
        console.log(info.event)
        const headers = {
                "Content-Type": "application/json"
                }
        const body = {
                start:  info.event._def.publicId,
                date : info.event._def.publicId,
        }

        axios.post('http://localhost:8000/event-delete',body,headers)
            .then((response)=>{
                
                if(response.data.isDelete){
                    info.event.remove()                              
                }
            })
    },
    events : events.data
});
calendar.render();
});