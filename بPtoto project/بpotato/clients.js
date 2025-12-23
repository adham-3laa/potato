const ClientsApp = {
    state: {
        clients: [],
        editing: false,
        searchTerm: ''
    },

    // عناصر DOM
    dom: {},

    // تهيئة التطبيق
    init() {
        this.cacheDomElements();
        this.bindEvents();
        this.loadClients();
        this.render();
        this.showToast('مرحبًا في نظام إدارة العملاء', 'info');
    },

    cacheDomElements() {
        this.dom = {
            clientForm: document.getElementById('clientForm'),
            formTitle: document.getElementById('formTitle'),
            clientId: document.getElementById('clientId'),
            fullName: document.getElementById('fullName'),
            address: document.getElementById('address'),
            phone: document.getElementById('phone'),
            submitBtn: document.getElementById('submitBtn'),
            cancelBtn: document.getElementById('cancelBtn'),
            
            addClientBtn: document.getElementById('addClientBtn'),
            
            clientsTableBody: document.getElementById('clientsTableBody'),
            emptyClients: document.getElementById('emptyClients'),
            searchClient: document.getElementById('searchClient'),
            
            clientsCount: document.getElementById('clientsCount'),
            totalClients: document.getElementById('totalClients'),
            
            toast: document.getElementById('toast')
        };
    },

    bindEvents() {
        this.dom.clientForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.dom.cancelBtn.addEventListener('click', () => this.resetForm());
        this.dom.addClientBtn.addEventListener('click', () => this.startAddClient());
        
        this.dom.searchClient.addEventListener('input', (e) => {
            this.state.searchTerm = e.target.value.toLowerCase();
            this.render();
        });
        
        window.addEventListener('beforeunload', () => {
            this.saveClients();
        });
    },

    loadClients() {
        try {
            const savedClients = localStorage.getItem('clientsData');
            this.state.clients = savedClients ? JSON.parse(savedClients) : [];
        } catch (error) {
            console.error('خطأ في تحميل العملاء:', error);
            this.state.clients = [];
        }
    },

    saveClients() {
        try {
            localStorage.setItem('clientsData', JSON.stringify(this.state.clients));
        } catch (error) {
            console.error('خطأ في حفظ العملاء:', error);
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        
        const clientData = {
            id: this.state.editing ? parseInt(this.dom.clientId.value) : Date.now(),
            fullName: this.dom.fullName.value.trim(),
            address: this.dom.address.value.trim(),
            phone: this.dom.phone.value.trim()
        };
        
        if (!clientData.fullName || !clientData.address || !clientData.phone) {
            this.showToast('الرجاء ملء جميع الحقول', 'error');
            return;
        }
        
        if (this.state.editing) {
            const index = this.state.clients.findIndex(c => c.id === clientData.id);
            if (index !== -1) {
                this.state.clients[index] = clientData;
                this.showToast('تم تحديث بيانات العميل', 'success');
            }
        } else {
            this.state.clients.unshift(clientData);
            this.showToast('تم إضافة العميل بنجاح', 'success');
        }
        
        this.saveClients();
        this.resetForm();
        this.render();
    },

    startAddClient() {
        this.state.editing = false;
        this.dom.formTitle.textContent = 'إضافة عميل جديد';
        this.dom.submitBtn.innerHTML = '<i class="fas fa-save"></i> حفظ';
        this.resetForm();
        
        document.querySelector('.client-form-container').scrollIntoView({ behavior: 'smooth' });
    },

    editClient(id) {
        const client = this.state.clients.find(c => c.id === id);
        if (!client) return;
        
        this.state.editing = true;
        
        this.dom.clientId.value = client.id;
        this.dom.fullName.value = client.fullName;
        this.dom.address.value = client.address;
        this.dom.phone.value = client.phone;
        
        this.dom.formTitle.textContent = 'تعديل بيانات العميل';
        this.dom.submitBtn.innerHTML = '<i class="fas fa-save"></i> تحديث';
        
        document.querySelector('.client-form-container').scrollIntoView({ behavior: 'smooth' });
    },

    deleteClient(id) {
        if (!confirm('هل تريد حذف هذا العميل؟')) {
            return;
        }
        
        this.state.clients = this.state.clients.filter(c => c.id !== id);
        this.saveClients();
        this.render();
        this.showToast('تم حذف العميل', 'warning');
    },

    resetForm() {
        this.dom.clientForm.reset();
        this.dom.clientId.value = '';
        this.state.editing = false;
        this.dom.formTitle.textContent = 'إضافة عميل جديد';
        this.dom.submitBtn.innerHTML = '<i class="fas fa-save"></i> حفظ';
    },

    render() {
        this.renderClientsList();
        this.updateStats();
    },

    renderClientsList() {
        let filteredClients = this.state.clients;
        
        if (this.state.searchTerm) {
            filteredClients = filteredClients.filter(client =>
                client.fullName.toLowerCase().includes(this.state.searchTerm) ||
                client.address.toLowerCase().includes(this.state.searchTerm) ||
                client.phone.includes(this.state.searchTerm)
            );
        }
        
        this.dom.clientsTableBody.innerHTML = '';
        
        if (filteredClients.length === 0) {
            this.dom.emptyClients.style.display = 'block';
        } else {
            this.dom.emptyClients.style.display = 'none';
            
            filteredClients.forEach((client, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${client.fullName}</td>
                    <td>${client.address}</td>
                    <td>${client.phone}</td>
                    <td>
                        <div class="actions-cell">
                            <div class="action-icon edit-btn" onclick="ClientsApp.editClient(${client.id})" title="تعديل">
                                <i class="fas fa-edit"></i>
                            </div>
                            <div class="action-icon delete-btn" onclick="ClientsApp.deleteClient(${client.id})" title="حذف">
                                <i class="fas fa-trash"></i>
                            </div>
                        </div>
                    </td>
                `;
                this.dom.clientsTableBody.appendChild(row);
            });
        }
    },

    updateStats() {
        const total = this.state.clients.length;
        this.dom.clientsCount.textContent = total;
        this.dom.totalClients.textContent = total;
    },

    showToast(message, type = 'info') {
        const toast = this.dom.toast;
        toast.textContent = message;
        toast.className = 'toast';
        
        if (type === 'error') toast.classList.add('toast-error');
        else if (type === 'warning') toast.classList.add('toast-warning');
        else if (type === 'success') toast.classList.add('toast-success');
        else toast.classList.add('toast-info');
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log(' تشغيل تطبيق إدارة العملاء...');
    ClientsApp.init();
});

window.ClientsApp = ClientsApp;