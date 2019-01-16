(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{16:function(e,t,n){e.exports=n(43)},22:function(e,t,n){},43:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),o=n(10),r=n.n(o),s=n(11),u=n(12),l=n(14),c=n(13),m=n(15),d=(n(22),function(e){return i.a.createElement("div",null,"rajaa n\xe4ytett\xe4vi\xe4 ",i.a.createElement("input",{id:"namefilter",onChange:e.handleFilteredPersons}))}),f=function(e){return i.a.createElement("form",{onSubmit:e.addOrUpdatePerson},i.a.createElement("div",null,"nimi: ",i.a.createElement("input",{id:"name",onChange:e.handleNameChange})),i.a.createElement("div",null,"puhelinumero: ",i.a.createElement("input",{id:"phonenumber",onChange:e.handleNumChange})),i.a.createElement("div",null,i.a.createElement("button",{type:"submit",onClick:e.validateInput},"lis\xe4\xe4")))},h=function(e){return i.a.createElement("table",null,i.a.createElement("tbody",null,e.personArray.map(function(t){return i.a.createElement("tr",{key:t.name},i.a.createElement("td",null,t.id),i.a.createElement("td",null,t.name),i.a.createElement("td",null,t.number),i.a.createElement("td",null,i.a.createElement("button",{onClick:function(){return e.removePerson(t.id)}},"Poista")))})))},p=function(e){return null===e.message?null:i.a.createElement("div",{className:e.style},e.message)},v=n(2),N=n.n(v),w="/api/persons",E={getAll:function(){return N.a.get(w).then(function(e){return e.data})},create:function(e){return N.a.post(w,e).then(function(e){return e.data})},update:function(e,t){return N.a.put("".concat(w,"/").concat(e),t).then(function(e){return e.data})},remove:function(e){return N.a.delete("".concat(w,"/").concat(e)).then(function(e){return e.data})}},b=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(l.a)(this,Object(c.a)(t).call(this,e))).addOrUpdatePerson=function(e){e.preventDefault();var t=n.state.persons.filter(function(e){return e.name===n.state.newName});t.length>0?n.updatePerson(t[0]):n.addPerson()},n.addPerson=function(){var e={name:n.state.newName,number:n.state.newNumber};E.create(e).then(function(e){n.setState({persons:n.state.persons.concat(e),newName:"",newNumber:""}),n.showNotification("Lisattiin ".concat(e.name),"successNotification"),n.clearInput()}).catch(function(e){return n.showNotification("Valitettavasti lisaaminen epaonnistui","errorNotification")})},n.updatePerson=function(e){e.number=n.state.newNumber,E.update(e.id,e).then(function(e){n.setState({persons:n.state.persons.map(function(t){return t.name!==e.name?t:e}),newName:"",newNumber:""}),n.showNotification("Paivitettiin ".concat(e.name),"successNotification"),n.clearInput()}).catch(function(t){-1!==t.message.indexOf("404")?E.create(e).then(n.setState({persons:n.state.persons.map(function(t){return t.id!==e.id?t:e})})).then(n.clearInput()).catch(function(e){return n.showNotification("Valitettavasti paivittaminen epaonnistui","errorNotification")}):n.showNotification("Valitettavasti paivittaminen epaonnistui","errorNotification")})},n.removePerson=function(e){E.remove(e).then(function(e){return E.getAll()}).then(function(e){n.setState({persons:e}),n.showNotification("Henkilo poistettu","successNotification")}).catch(function(t){-1!==t.message.indexOf("404")?n.setState({persons:n.state.persons.filter(function(t){return t.id!==e})}):n.showNotification("Valitettavasti poistaminen epaonnistui","errorNotification")})},n.handleNameChange=function(e){n.setState({newName:e.target.value})},n.handleNumChange=function(e){n.setState({newNumber:e.target.value})},n.clearInput=function(){document.getElementById("name").value="",document.getElementById("phonenumber").value=""},n.handleFilteredPersons=function(e){var t=n.state.persons.filter(function(t){return t.name.toLowerCase().includes(e.target.value.toLowerCase())});n.setState({filteredPersons:t})},n.validateInput=function(e){0===n.state.newName.length&&(e.preventDefault(),n.showNotification("Annettu nimi ei ole kelvollinen","errorNotification"))},n.showNotification=function(e,t){n.setState({notification:e,notificationStyle:t}),setTimeout(function(){n.setState({notification:null,notificationStyle:null})},5e3)},n.state={persons:[],filteredPersons:[],newName:"",newNumber:"",notification:null,notificationStyle:null},n}return Object(m.a)(t,e),Object(u.a)(t,[{key:"componentDidMount",value:function(){var e=this;E.getAll().then(function(t){e.setState({persons:t})}).catch(function(t){return e.showNotification("Valitettavasti kontaktien lataaminen palvelimelta epaonnistui","errorNotification")})}},{key:"render",value:function(){var e=0===this.state.filteredPersons.length?this.state.persons:this.state.filteredPersons;return i.a.createElement("div",null,i.a.createElement("h1",null,"Puhelinluettelo"),i.a.createElement(p,{style:this.state.notificationStyle,message:this.state.notification}),i.a.createElement(d,{handleFilteredPersons:this.handleFilteredPersons.bind(this)}),i.a.createElement("h2",null,"Lis\xe4\xe4 uusi kontakti / muuta kontaktin numeroa"),i.a.createElement(f,{addOrUpdatePerson:this.addOrUpdatePerson.bind(this),handleNameChange:this.handleNameChange.bind(this),handleNumChange:this.handleNumChange.bind(this),validateInput:this.validateInput.bind(this)}),i.a.createElement("h2",null,"Numerot"),i.a.createElement(h,{personArray:e,removePerson:this.removePerson}))}}]),t}(i.a.Component);r.a.render(i.a.createElement(b,null),document.getElementById("root"))}},[[16,2,1]]]);
//# sourceMappingURL=main.28a63507.chunk.js.map