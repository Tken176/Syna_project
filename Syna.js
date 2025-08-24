/**
 * Syna - Ứng dụng quản lý chi tiêu thông minh
 * Version: 2.0.0
 */

class SynaApp {
    constructor() {
        // App state
        this.data = {
            monthlyIncome: 0,
            dailyBudget: 0,
            expenses: [],
            currentMonth: new Date().getMonth(),
            currentYear: new Date().getFullYear(),
            isSetup: false,
            theme: 'light',
            savings: [], // Lịch sử tiết kiệm
            goals: [],   // Mục tiêu tiết kiệm
            savingsSettings: {
                autoSave: true,
                dailyGoal: 0
            },
            notifications: {
                dailyReminder: true,
                budgetWarning: true,
                goalProgress: true
            }
        };

        // DOM elements
        this.elements = {};
        
        // Chart instance
        this.chart = null;

        // Selected category for expenses
        this.selectedCategory = 'food';

        // Confirmation callback
        this.confirmCallback = null;

        this.init();
    }

    init() {
        this.bindElements();
        this.loadData();
        this.setupEventListeners();
        this.checkFirstTimeSetup();
        this.updateUI();
        this.initChart();
        this.applyTheme();
    }

    bindElements() {
        // Theme toggles
        this.elements.themeToggle = document.getElementById('theme-toggle');
        this.elements.desktopThemeToggle = document.getElementById('desktop-theme-toggle');
        
        // Profile buttons
        this.elements.profileBtn = document.getElementById('profile-btn');
        this.elements.desktopProfileBtn = document.getElementById('desktop-profile-btn');
        
        // Salary setup
        this.elements.salarySetup = document.getElementById('salary-setup');
        this.elements.mainApp = document.getElementById('main-app');
        this.elements.salaryTabs = document.querySelectorAll('.salary-tab');
        this.elements.salaryTabContents = document.querySelectorAll('.salary-tab-content');
        this.elements.monthlySalary = document.getElementById('monthly-salary');
        this.elements.weeklySalary = document.getElementById('weekly-salary');
        this.elements.dailySalary = document.getElementById('daily-salary');
        this.elements.saveSalaryBtn = document.getElementById('save-salary-btn');
        
        // Expense form
        this.elements.expenseAmount = document.getElementById('expense-amount');
        this.elements.expenseNote = document.getElementById('expense-note');
        this.elements.categoryOptions = document.querySelectorAll('.category-option');
        this.elements.addExpenseBtn = document.getElementById('add-expense-btn');
        
        // Statistics
        this.elements.todayExpense = document.getElementById('today-expense');
        this.elements.todayRemaining = document.getElementById('today-remaining');
        this.elements.weeklyExpense = document.getElementById('weekly-expense');
        this.elements.monthlyRemaining = document.getElementById('monthly-remaining');
        
        // Expense list
        this.elements.expenseList = document.getElementById('expense-list');
        
        // Recommendation
        this.elements.recommendationText = document.getElementById('recommendation-text');
        
        // Profile modal
        this.elements.profileModal = document.getElementById('profile-modal');
        this.elements.closeProfileModal = document.getElementById('close-profile-modal');
        this.elements.currentMonthlyIncome = document.getElementById('current-monthly-income');
        this.elements.currentDailyBudget = document.getElementById('current-daily-budget');
        this.elements.newSalary = document.getElementById('new-salary');
        this.elements.updateSalaryBtn = document.getElementById('update-salary-btn');
        this.elements.resetMonthBtn = document.getElementById('reset-month-btn');
        this.elements.resetAllBtn = document.getElementById('reset-all-btn');
        
        // Confirmation modal
        this.elements.confirmModal = document.getElementById('confirm-modal');
        this.elements.confirmTitle = document.getElementById('confirm-title');
        this.elements.confirmMessage = document.getElementById('confirm-message');
        this.elements.confirmCancel = document.getElementById('confirm-cancel');
        this.elements.confirmOk = document.getElementById('confirm-ok');
        
        // Toast
        this.elements.successToast = document.getElementById('success-toast');
        this.elements.toastMessage = document.getElementById('toast-message');
        
        // Chart
        this.elements.expenseChart = document.getElementById('expense-chart');
        
        // Goals modal
        this.elements.goalsModal = document.getElementById('goals-modal');
        this.elements.viewGoalsBtn = document.getElementById('view-goals-btn');
        this.elements.closeGoalsModal = document.getElementById('close-goals-modal');
        this.elements.goalName = document.getElementById('goal-name');
        this.elements.goalAmount = document.getElementById('goal-amount');
        this.elements.addGoalBtn = document.getElementById('add-goal-btn');
        this.elements.goalsList = document.getElementById('goals-list');

        // Analysis modal
        this.elements.analysisModal = document.getElementById('analysis-modal');
        this.elements.detailedAnalysisBtn = document.getElementById('detailed-analysis-btn');
        this.elements.closeAnalysisModal = document.getElementById('close-analysis-modal');

        // Savings elements
        this.elements.dailySavings = document.getElementById('daily-savings');
        this.elements.totalSavings = document.getElementById('total-savings');
        this.elements.monthlySavings = document.getElementById('monthly-savings');
        this.elements.savingsStreak = document.getElementById('savings-streak');
        this.elements.savingsHistory = document.getElementById('savings-history');

        // Analysis elements
        this.elements.budgetUsage = document.getElementById('budget-usage');
        this.elements.avgDaily = document.getElementById('avg-daily');
        this.elements.topCategory = document.getElementById('top-category');
        this.elements.spendingDays = document.getElementById('spending-days');
        this.elements.categoryChart = document.getElementById('category-chart');
    }

    setupEventListeners() {
        // Theme toggles
        this.elements.themeToggle?.addEventListener('click', () => this.toggleTheme());
        this.elements.desktopThemeToggle?.addEventListener('click', () => this.toggleTheme());
        
        // Profile buttons
        this.elements.profileBtn?.addEventListener('click', () => this.openProfileModal());
        this.elements.desktopProfileBtn?.addEventListener('click', () => this.openProfileModal());
        
        // Salary setup
        this.elements.salaryTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchSalaryTab(tab.dataset.period));
        });
        this.elements.saveSalaryBtn?.addEventListener('click', () => this.saveSalary());
        
        // Category selection
        this.elements.categoryOptions.forEach(option => {
            option.addEventListener('click', () => this.selectCategory(option.dataset.category));
        });
        
        // Add expense
        this.elements.addExpenseBtn?.addEventListener('click', () => this.addExpense());
        this.elements.expenseAmount?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addExpense();
        });
        
        // Profile modal
        this.elements.closeProfileModal?.addEventListener('click', () => this.closeProfileModal());
        this.elements.updateSalaryBtn?.addEventListener('click', () => this.updateSalary());
        this.elements.resetMonthBtn?.addEventListener('click', () => this.confirmReset('month'));
        this.elements.resetAllBtn?.addEventListener('click', () => this.confirmReset('all'));
        
        // Confirmation modal
        this.elements.confirmCancel?.addEventListener('click', () => this.closeConfirmModal());
        this.elements.confirmOk?.addEventListener('click', () => this.executeConfirm());
        
        // Modal backdrop clicks
        this.elements.profileModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.profileModal) this.closeProfileModal();
        });
        this.elements.confirmModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.confirmModal) this.closeConfirmModal();
        });

        // Auto-save when typing in expense fields
        this.elements.expenseAmount?.addEventListener('input', () => this.debounce(() => this.saveData(), 1000));
        this.elements.expenseNote?.addEventListener('input', () => this.debounce(() => this.saveData(), 1000));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'n':
                        e.preventDefault();
                        this.elements.expenseAmount?.focus();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.openProfileModal();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                }
            }
        });
        
        // Goals modal
        this.elements.viewGoalsBtn?.addEventListener('click', () => this.openGoalsModal());
        this.elements.closeGoalsModal?.addEventListener('click', () => this.closeGoalsModal());
        this.elements.addGoalBtn?.addEventListener('click', () => this.addGoal());

        // Analysis modal  
        this.elements.detailedAnalysisBtn?.addEventListener('click', () => this.openAnalysisModal());
        this.elements.closeAnalysisModal?.addEventListener('click', () => this.closeAnalysisModal());

        // Modal backdrop clicks
        this.elements.goalsModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.goalsModal) this.closeGoalsModal();
        });
        this.elements.analysisModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.analysisModal) this.closeAnalysisModal();
        });
    }

    checkFirstTimeSetup() {
        if (!this.data.isSetup) {
            this.elements.salarySetup.style.display = 'block';
            this.elements.mainApp.style.display = 'none';
        } else {
            this.elements.salarySetup.style.display = 'none';
            this.elements.mainApp.style.display = 'block';
        }
    }

    switchSalaryTab(period) {
        // Remove active class from all tabs
        this.elements.salaryTabs.forEach(tab => tab.classList.remove('active'));
        this.elements.salaryTabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab
        document.querySelector(`[data-period="${period}"]`).classList.add('active');
        document.getElementById(`${period}-tab`).classList.add('active');
    }

    saveSalary() {
        const activeTab = document.querySelector('.salary-tab.active').dataset.period;
        let monthlyIncome = 0;

        switch(activeTab) {
            case 'monthly':
                monthlyIncome = parseInt(this.elements.monthlySalary.value) || 0;
                break;
            case 'weekly':
                const weeklyIncome = parseInt(this.elements.weeklySalary.value) || 0;
                monthlyIncome = Math.round(weeklyIncome * 52 / 12);
                break;
            case 'daily':
                const dailyIncome = parseInt(this.elements.dailySalary.value) || 0;
                const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
                monthlyIncome = dailyIncome * daysInMonth;
                break;
        }

        if (monthlyIncome <= 0) {
            this.showToast('Vui lòng nhập thu nhập hợp lệ!', 'error');
            return;
        }

        this.data.monthlyIncome = monthlyIncome;
        this.data.dailyBudget = Math.round(monthlyIncome / new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate());
        this.data.isSetup = true;

        this.saveData();
        this.checkFirstTimeSetup();
        this.updateUI();
        this.showToast('Thiết lập thành công! Chào mừng đến với Syna!');
    }

    selectCategory(category) {
        this.elements.categoryOptions.forEach(option => option.classList.remove('active'));
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        this.selectedCategory = category;
    }

    addExpense() {
        const amount = parseInt(this.elements.expenseAmount.value) || 0;
        const note = this.elements.expenseNote.value.trim();

        if (amount <= 0) {
            this.showToast('Vui lòng nhập số tiền hợp lệ!', 'error');
            this.elements.expenseAmount.focus();
            return;
        }

        const expense = {
            id: Date.now(),
            amount: amount,
            category: this.selectedCategory,
            note: note || this.getCategoryName(this.selectedCategory),
            date: new Date().toISOString(),
            month: new Date().getMonth(),
            year: new Date().getFullYear()
        };

        this.data.expenses.unshift(expense);
        
        // Clear form
        this.elements.expenseAmount.value = '';
        this.elements.expenseNote.value = '';
        this.elements.expenseAmount.focus();

        this.saveData();
        this.updateUI();
        this.showToast(`Đã thêm chi tiêu ${this.formatCurrency(amount)}`);
    }

    updateSalary() {
        const newSalary = parseInt(this.elements.newSalary.value) || 0;
        
        if (newSalary <= 0) {
            this.showToast('Vui lòng nhập thu nhập hợp lệ!', 'error');
            return;
        }

        this.data.monthlyIncome = newSalary;
        this.data.dailyBudget = Math.round(newSalary / new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate());
        
        this.elements.newSalary.value = '';
        this.saveData();
        this.updateUI();
        this.closeProfileModal();
        this.showToast('Cập nhật thu nhập thành công!');
    }

    confirmReset(type) {
        if (type === 'month') {
            this.elements.confirmTitle.textContent = 'Reset tháng này';
            this.elements.confirmMessage.textContent = 'Bạn có chắc chắn muốn xóa tất cả chi tiêu trong tháng này? Hành động này không thể hoàn tác.';
            this.confirmCallback = () => this.resetMonth();
        } else if (type === 'all') {
            this.elements.confirmTitle.textContent = 'Xóa tất cả dữ liệu';
            this.elements.confirmMessage.textContent = 'Bạn có chắc chắn muốn xóa toàn bộ dữ liệu ứng dụng? Bao gồm thu nhập và tất cả chi tiêu. Hành động này không thể hoàn tác.';
            this.confirmCallback = () => this.resetAll();
        }
        
        this.openConfirmModal();
    }

    resetMonth() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        this.data.expenses = this.data.expenses.filter(expense => 
            expense.month !== currentMonth || expense.year !== currentYear
        );
        
        this.saveData();
        this.updateUI();
        this.closeConfirmModal();
        this.closeProfileModal();
        this.showToast('Đã reset dữ liệu tháng này!');
    }

    resetAll() {
        const defaultData = {
            monthlyIncome: 0,
            dailyBudget: 0,
            expenses: [],
            currentMonth: new Date().getMonth(),
            currentYear: new Date().getFullYear(),
            isSetup: false,
            theme: this.data.theme, // Keep theme preference
            savings: [],
            goals: [],
            savingsSettings: {
                autoSave: true,
                dailyGoal: 0
            },
            notifications: {
                dailyReminder: true,
                budgetWarning: true,
                goalProgress: true
            }
        };
        
        this.data = defaultData;
        this.saveData();
        this.closeConfirmModal();
        this.closeProfileModal();
        this.checkFirstTimeSetup();
        this.updateUI();
        this.showToast('Đã xóa tất cả dữ liệu!');
    }

    updateUI() {
        this.updateStats();
        this.updateExpenseList();
        this.updateRecommendation();
        this.updateProfileModal();
        this.updateChart();

        // Bổ sung
        this.saveDailySavings();
        this.updateSavingsDisplay();
        this.updateBudgetAnalysis();
        this.checkNotifications();
    }

    updateStats() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const todayString = today.toDateString();

        // Calculate expenses
        const todayExpenses = this.data.expenses.filter(expense => 
            new Date(expense.date).toDateString() === todayString
        );
        
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weeklyExpenses = this.data.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= weekStart && expenseDate <= today;
        });
        
        const monthlyExpenses = this.data.expenses.filter(expense => 
            expense.month === currentMonth && expense.year === currentYear
        );

        const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const weeklyTotal = weeklyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        // Update display
        this.elements.todayExpense.textContent = this.formatCurrency(todayTotal);
        
        const todayRemaining = this.data.dailyBudget - todayTotal;
        this.elements.todayRemaining.textContent = this.formatCurrency(todayRemaining);
        this.elements.todayRemaining.className = `stat-value ${todayRemaining >= 0 ? 'positive' : 'negative'}`;
        
        this.elements.weeklyExpense.textContent = this.formatCurrency(weeklyTotal);
        
        const monthlyRemaining = this.data.monthlyIncome - monthlyTotal;
        this.elements.monthlyRemaining.textContent = this.formatCurrency(monthlyRemaining);
        this.elements.monthlyRemaining.className = `stat-value ${monthlyRemaining >= 0 ? 'positive' : 'negative'}`;
    }

    updateExpenseList() {
        const recentExpenses = this.data.expenses.slice(0, 10);
        
        if (recentExpenses.length === 0) {
            this.elements.expenseList.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <span>Chưa có chi tiêu nào</span>
                </li>
            `;
            return;
        }

        this.elements.expenseList.innerHTML = recentExpenses.map(expense => {
            const date = new Date(expense.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
            const categoryInfo = this.getCategoryInfo(expense.category);
            
            return `
                <li class="expense-item">
                    <div class="expense-info">
                        <div class="expense-category">
                            <i class="${categoryInfo.icon}"></i>
                            ${categoryInfo.name}
                        </div>
                        <div class="expense-note">${expense.note}</div>
                        <div class="expense-date">${formattedDate}</div>
                    </div>
                    <div class="expense-amount">-${this.formatCurrency(expense.amount)}</div>
                </li>
            `;
        }).join('');
    }

    updateRecommendation() {
        if (!this.data.isSetup) {
            this.elements.recommendationText.textContent = 'Hãy thiết lập thu nhập để bắt đầu sử dụng Syna!';
            return;
        }

        const today = new Date();
        const todayExpenses = this.data.expenses.filter(expense => 
            new Date(expense.date).toDateString() === today.toDateString()
        );
        const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const percentage = (todayTotal / this.data.dailyBudget) * 100;

        let message = '';
        let recommendation = '';

        if (todayTotal === 0) {
            message = `Hôm nay bạn chưa chi tiêu gì. `;
            recommendation = `Ngân sách hôm nay là ${this.formatCurrency(this.data.dailyBudget)}. Hãy chi tiêu thông minh!`;
        } else if (percentage < 50) {
            message = `🎉 Tuyệt vời! Bạn đã chi tiêu ${percentage.toFixed(0)}% ngân sách hôm nay. `;
            recommendation = `Còn ${this.formatCurrency(this.data.dailyBudget - todayTotal)} có thể chi tiêu.`;
        } else if (percentage < 80) {
            message = `✅ Bạn đang chi tiêu hợp lý (${percentage.toFixed(0)}% ngân sách). `;
            recommendation = `Còn ${this.formatCurrency(this.data.dailyBudget - todayTotal)} cho hôm nay.`;
        } else if (percentage < 100) {
            message = `⚠️ Hãy cẩn thận! Đã chi ${percentage.toFixed(0)}% ngân sách. `;
            recommendation = `Chỉ còn ${this.formatCurrency(this.data.dailyBudget - todayTotal)} cho hôm nay.`;
        } else {
            const over = percentage - 100;
            message = `🚨 Cảnh báo! Vượt ngân sách ${over.toFixed(0)}%. `;
            recommendation = `Hãy cân nhắc giảm chi tiêu những ngày tới.`;
        }

        // Add AI-like suggestions
        const suggestions = this.getSmartSuggestions(todayTotal, percentage);
        if (suggestions.length > 0) {
            recommendation += ` 💡 ${suggestions[Math.floor(Math.random() * suggestions.length)]}`;
        }

        this.elements.recommendationText.textContent = message + recommendation;
    }

    getSmartSuggestions(todayTotal, percentage) {
        const suggestions = [];
        
        if (percentage < 30) {
            suggestions.push('Bạn có thể đầu tư thêm vào giáo dục hoặc sức khỏe.');
            suggestions.push('Xem xét tiết kiệm số tiền dư thừa này.');
            suggestions.push('Đây là cơ hội tuyệt vời để tích lũy.');
        } else if (percentage < 70) {
            suggestions.push('Hãy theo dõi chi tiêu buổi chiều và tối.');
            suggestions.push('Cân nhắc nấu ăn tại nhà để tiết kiệm.');
            suggestions.push('Kiểm tra xem có chi phí không cần thiết nào không.');
        } else if (percentage < 100) {
            suggestions.push('Ưu tiên chi tiêu cho những thứ thực sự cần thiết.');
            suggestions.push('Tránh mua sắm impulsive.');
            suggestions.push('Xem xét hoãn những khoản chi không khẩn cấp.');
        } else {
            suggestions.push('Hãy xem lại ngân sách hàng tháng.');
            suggestions.push('Tìm cách cắt giảm chi phí trong những ngày tới.');
            suggestions.push('Phân tích lại thói quen chi tiêu của bạn.');
        }
        
        return suggestions;
    }

    updateProfileModal() {
        if (this.elements.currentMonthlyIncome) {
            this.elements.currentMonthlyIncome.textContent = this.formatCurrency(this.data.monthlyIncome);
        }
        if (this.elements.currentDailyBudget) {
            this.elements.currentDailyBudget.textContent = this.formatCurrency(this.data.dailyBudget);
        }
    }

    initChart() {
        const ctx = this.elements.expenseChart?.getContext('2d');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                datasets: [{
                    label: 'Chi tiêu (VND)',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#8b5cf6', '#ef4444'
                    ],
                    borderColor: [
                        '#dc2626', '#d97706', '#059669', '#0891b2', '#4f46e5', '#7c3aed', '#dc2626'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Chi tiêu: ${this.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value, false)
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                elements: {
                    bar: {
                        borderRadius: 8
                    }
                }
            }
        });

        this.updateChart();
    }

    updateChart() {
        if (!this.chart) return;

        const weekData = this.getWeeklyExpenseData();
        this.chart.data.datasets[0].data = weekData;
        this.chart.update('none'); // No animation for better performance
    }

    getWeeklyExpenseData() {
        const today = new Date();
        const weekData = [0, 0, 0, 0, 0, 0, 0]; // Sunday to Saturday
        
        // Get expenses for the current week
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - today.getDay() + i);
            
            const dayExpenses = this.data.expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.toDateString() === date.toDateString();
            });
            
            weekData[i] = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        }
        
        return weekData;
    }

    getCategoryInfo(category) {
        const categories = {
            food: { name: 'Ăn uống', icon: 'fas fa-utensils' },
            transport: { name: 'Di chuyển', icon: 'fas fa-car' },
            shopping: { name: 'Mua sắm', icon: 'fas fa-shopping-bag' },
            entertainment: { name: 'Giải trí', icon: 'fas fa-gamepad' },
            bill: { name: 'Hóa đơn', icon: 'fas fa-file-invoice' },
            health: { name: 'Sức khỏe', icon: 'fas fa-heart' },
            education: { name: 'Giáo dục', icon: 'fas fa-book' },
            other: { name: 'Khác', icon: 'fas fa-ellipsis-h' }
        };
        
        return categories[category] || categories.other;
    }

    getCategoryName(category) {
        return this.getCategoryInfo(category).name;
    }

    // Theme Management
    toggleTheme() {
        this.data.theme = this.data.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveData();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.data.theme);
        
        const themeIcons = document.querySelectorAll('.theme-toggle i');
        themeIcons.forEach(icon => {
            if (this.data.theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });

        // Update chart colors if chart exists
        if (this.chart) {
            const isDark = this.data.theme === 'dark';
            this.chart.options.scales.x.ticks.color = isDark ? '#cbd5e1' : '#475569';
            this.chart.options.scales.y.ticks.color = isDark ? '#cbd5e1' : '#475569';
            this.chart.options.scales.x.grid.color = isDark ? '#334155' : '#e2e8f0';
            this.chart.options.scales.y.grid.color = isDark ? '#334155' : '#e2e8f0';
            this.chart.update('none');
        }
    }

    // Modal Management
    openProfileModal() {
        this.elements.profileModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeProfileModal() {
        this.elements.profileModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    openConfirmModal() {
        this.elements.confirmModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeConfirmModal() {
        this.elements.confirmModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        this.confirmCallback = null;
    }

    executeConfirm() {
        if (this.confirmCallback) {
            this.confirmCallback();
        }
    }

    // Toast Management
    showToast(message, type = 'success') {
        this.elements.toastMessage.textContent = message;
        this.elements.successToast.className = `toast ${type} show`;
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            this.elements.successToast.classList.remove('show');
        }, 3000);
    }

    // Utility Functions
    formatCurrency(amount, showVND = true) {
        return new Intl.NumberFormat('vi-VN', {
            style: showVND ? 'currency' : 'decimal',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Data Management
    saveData() {
        localStorage.setItem('syna-app-data', JSON.stringify(this.data));
    }

    loadData() {
        const savedData = localStorage.getItem('syna-app-data');
        if (savedData) {
            this.data = {
                ...this.data, // Keep default structure
                ...JSON.parse(savedData) // Override with saved data
            };
        }
    }

    // ==================== NEW METHODS ====================

    // Savings Management
    saveDailySavings() {
        if (!this.data.savingsSettings.autoSave) return;
        
        const today = new Date().toDateString();
        const todayExpenses = this.data.expenses.filter(expense => 
            new Date(expense.date).toDateString() === today
        );
        const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        const dailySavings = Math.max(0, this.data.dailyBudget - todayTotal);
        
        // Check if we already saved for today
        const todaySaved = this.data.savings.find(s => 
            new Date(s.date).toDateString() === today
        );
        
        if (!todaySaved && dailySavings > 0) {
            this.data.savings.push({
                date: new Date().toISOString(),
                amount: dailySavings,
                type: 'auto'
            });
            this.saveData();
        }
    }

    updateSavingsDisplay() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Calculate savings
        const totalSavings = this.data.savings.reduce((sum, saving) => sum + saving.amount, 0);
        const monthlySavings = this.data.savings.reduce((sum, saving) => {
            const savingDate = new Date(saving.date);
            if (savingDate.getMonth() === currentMonth && savingDate.getFullYear() === currentYear) {
                return sum + saving.amount;
            }
            return sum;
        }, 0);
        
        // Calculate streak (consecutive days with savings)
        let streak = 0;
        const sortedSavings = [...this.data.savings].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        let currentDate = new Date();
        for (let i = 0; i < sortedSavings.length; i++) {
            const savingDate = new Date(sortedSavings[i].date).toDateString();
            const expectedDate = currentDate.toDateString();
            
            if (savingDate === expectedDate) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        // Update UI
        this.elements.dailySavings.textContent = this.formatCurrency(this.data.dailyBudget - this.getTodayExpenseTotal());
        this.elements.totalSavings.textContent = this.formatCurrency(totalSavings);
        this.elements.monthlySavings.textContent = this.formatCurrency(monthlySavings);
        this.elements.savingsStreak.textContent = `${streak} ngày`;
        
        // Update savings history
        this.updateSavingsHistory();
    }

    getTodayExpenseTotal() {
        const today = new Date().toDateString();
        return this.data.expenses
            .filter(expense => new Date(expense.date).toDateString() === today)
            .reduce((sum, expense) => sum + expense.amount, 0);
    }

    updateSavingsHistory() {
        const recentSavings = [...this.data.savings]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        if (recentSavings.length === 0) {
            this.elements.savingsHistory.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-piggy-bank"></i>
                    <span>Chưa có tiết kiệm nào</span>
                </li>
            `;
            return;
        }
        
        this.elements.savingsHistory.innerHTML = recentSavings.map(saving => {
            const date = new Date(saving.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
            
            return `
                <li class="savings-item">
                    <div class="savings-info">
                        <div class="savings-date">${formattedDate}</div>
                        <div class="savings-type">${saving.type === 'auto' ? 'Tự động' : 'Thủ công'}</div>
                    </div>
                    <div class="savings-amount">+${this.formatCurrency(saving.amount)}</div>
                </li>
            `;
        }).join('');
    }

    // Goals Management
    openGoalsModal() {
        this.elements.goalsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        this.updateGoalsList();
    }

    closeGoalsModal() {
        this.elements.goalsModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    addGoal() {
        const name = this.elements.goalName.value.trim();
        const amount = parseInt(this.elements.goalAmount.value) || 0;
        
        if (!name || amount <= 0) {
            this.showToast('Vui lòng nhập tên và số tiền hợp lệ!', 'error');
            return;
        }
        
        const totalSavings = this.data.savings.reduce((sum, saving) => sum + saving.amount, 0);
        
        this.data.goals.push({
            id: Date.now(),
            name: name,
            targetAmount: amount,
            currentAmount: totalSavings,
            createdAt: new Date().toISOString(),
            completed: false
        });
        
        this.elements.goalName.value = '';
        this.elements.goalAmount.value = '';
        
        this.saveData();
        this.updateGoalsList();
        this.showToast('Đã thêm mục tiêu mới!');
    }

    updateGoalsList() {
        if (this.data.goals.length === 0) {
            this.elements.goalsList.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-bullseye"></i>
                    <span>Chưa có mục tiêu nào</span>
                </li>
            `;
            return;
        }
        
        this.elements.goalsList.innerHTML = this.data.goals.map(goal => {
            const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            
            return `
                <li class="goal-item ${goal.completed ? 'completed' : ''}">
                    <div class="goal-header">
                        <h4 class="goal-name">${goal.name}</h4>
                        <span class="goal-amount">${this.formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text">${progress.toFixed(0)}%</span>
                    </div>
                    <div class="goal-details">
                        <span>Đã tiết kiệm: ${this.formatCurrency(goal.currentAmount)}</span>
                        <span>Còn lại: ${this.formatCurrency(remaining)}</span>
                    </div>
                    ${!goal.completed ? `
                    <button class="btn-delete" onclick="app.deleteGoal(${goal.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </li>
            `;
        }).join('');
    }

    deleteGoal(goalId) {
        this.data.goals = this.data.goals.filter(goal => goal.id !== goalId);
        this.saveData();
        this.updateGoalsList();
        this.showToast('Đã xóa mục tiêu!');
    }

    // Analysis Management
    openAnalysisModal() {
        this.elements.analysisModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        this.updateAnalysisData();
    }

    closeAnalysisModal() {
        this.elements.analysisModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    updateBudgetAnalysis() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        const monthlyExpenses = this.data.expenses.filter(expense => 
            expense.month === currentMonth && expense.year === currentYear
        );
        
        const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const budgetUsage = (totalSpent / this.data.monthlyIncome) * 100;
        
        const daysPassed = today.getDate();
        const expectedSpending = (this.data.monthlyIncome / 30) * daysPassed;
        const spendingRatio = (totalSpent / expectedSpending) * 100;
        
        // Update UI
        this.elements.budgetUsage.textContent = `${budgetUsage.toFixed(1)}%`;
        this.elements.avgDaily.textContent = this.formatCurrency(totalSpent / daysPassed);
        
        // Find top category
        const categoryTotals = {};
        monthlyExpenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });
        
        let topCategory = 'Chưa có';
        let topAmount = 0;
        
        Object.entries(categoryTotals).forEach(([category, amount]) => {
            if (amount > topAmount) {
                topCategory = this.getCategoryName(category);
                topAmount = amount;
            }
        });
        
        this.elements.topCategory.textContent = topCategory;
        
        // Calculate spending days
        const spendingDays = new Set(
            monthlyExpenses.map(expense => new Date(expense.date).getDate())
        ).size;
        
        this.elements.spendingDays.textContent = `${spendingDays}/${daysPassed} ngày`;
    }

    updateAnalysisData() {
        this.updateBudgetAnalysis();
        this.updateCategoryChart();
    }

    updateCategoryChart() {
        const ctx = this.elements.categoryChart?.getContext('2d');
        if (!ctx) return;
        
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        const monthlyExpenses = this.data.expenses.filter(expense => 
            expense.month === currentMonth && expense.year === currentYear
        );
        
        const categoryTotals = {};
        monthlyExpenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });
        
        const categories = Object.keys(categoryTotals);
        const amounts = Object.values(categoryTotals);
        const colors = categories.map(category => this.getCategoryColor(category));
        
        // Create or update chart
        if (this.categoryChart) {
            this.categoryChart.data.labels = categories.map(cat => this.getCategoryName(cat));
            this.categoryChart.data.datasets[0].data = amounts;
            this.categoryChart.data.datasets[0].backgroundColor = colors;
            this.categoryChart.update();
        } else {
            this.categoryChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: categories.map(cat => this.getCategoryName(cat)),
                    datasets: [{
                        data: amounts,
                        backgroundColor: colors,
                        borderWidth: 2,
                        borderColor: this.data.theme === 'dark' ? '#1e293b' : '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: this.data.theme === 'dark' ? '#cbd5e1' : '#475569'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const value = context.parsed;
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${context.label}: ${this.formatCurrency(value)} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    getCategoryColor(category) {
        const colors = {
            food: '#ef4444',
            transport: '#f59e0b',
            shopping: '#8b5cf6',
            entertainment: '#ec4899',
            bill: '#06b6d4',
            health: '#10b981',
            education: '#6366f1',
            other: '#94a3b8'
        };
        
        return colors[category] || colors.other;
    }

    // Notifications Management
    checkNotifications() {
        if (!this.data.notifications.budgetWarning) return;
        
        const todayTotal = this.getTodayExpenseTotal();
        const percentage = (todayTotal / this.data.dailyBudget) * 100;
        
        if (percentage >= 80) {
            this.showBudgetWarning(percentage);
        }
        
        // Check for goal progress
        if (this.data.notifications.goalProgress) {
            this.checkGoalProgress();
        }
    }

    showBudgetWarning(percentage) {
        const message = percentage >= 100 ? 
            `🚨 Bạn đã vượt quá ngân sách hôm nay ${(percentage - 100).toFixed(0)}%!` :
            `⚠️ Bạn đã chi tiêu ${percentage.toFixed(0)}% ngân sách hôm nay.`;
            
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Cảnh báo ngân sách', {
                body: message,
                icon: '/icon-192.png'
            });
        }
        
        // Also show in-app toast
        this.showToast(message, 'error');
    }

    checkGoalProgress() {
        const totalSavings = this.data.savings.reduce((sum, saving) => sum + saving.amount, 0);
        
        this.data.goals.forEach(goal => {
            if (goal.completed) return;
            
            const progress = (totalSavings / goal.targetAmount) * 100;
            
            if (progress >= 100 && !goal.completed) {
                goal.completed = true;
                this.showGoalCompleteNotification(goal.name);
            } else if (progress >= 75) {
                this.showGoalProgressNotification(goal.name, progress);
            }
        });
    }

    showGoalCompleteNotification(goalName) {
        const message = `🎉 Chúc mừng! Bạn đã đạt được mục tiêu "${goalName}"!`;
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Mục tiêu hoàn thành', {
                body: message,
                icon: '/icon-192.png'
            });
        }
        
        this.showToast(message);
    }

    showGoalProgressNotification(goalName, progress) {
        const message = `✅ Bạn đã đạt ${progress.toFixed(0)}% mục tiêu "${goalName}"!`;
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Tiến triển mục tiêu', {
                body: message,
                icon: '/icon-192.png'
            });
        }
    }

    // Advanced Export Functionality
    exportData(type = 'csv') {
        if (type === 'csv') {
            this.exportToCSV();
        } else {
            this.exportToJSON();
        }
    }

    exportToCSV() {
        let csvContent = 'Ngày,Danh mục,Ghi chú,Số tiền\n';
        
        this.data.expenses.forEach(expense => {
            const date = new Date(expense.date).toLocaleDateString('vi-VN');
            const category = this.getCategoryName(expense.category);
            const note = expense.note.replace(/,/g, ';');
            const amount = expense.amount;
            
            csvContent += `${date},${category},${note},${amount}\n`;
        });
        
        this.downloadFile(csvContent, 'syna-expenses.csv', 'text/csv');
    }

    exportToJSON() {
        const exportData = {
            exportedAt: new Date().toISOString(),
            monthlyIncome: this.data.monthlyIncome,
            dailyBudget: this.data.dailyBudget,
            expenses: this.data.expenses,
            savings: this.data.savings,
            goals: this.data.goals
        };
        
        const jsonContent = JSON.stringify(exportData, null, 2);
        this.downloadFile(jsonContent, 'syna-data.json', 'application/json');
    }

    downloadFile(content, fileName, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize app
const app = new SynaApp();

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Request notification permission
if ('Notification' in window) {
    Notification.requestPermission();
}