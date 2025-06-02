function toggleInput(id) {
    const input = document.getElementById(id);
    input.hidden = !input.hidden;
    if (input.hidden) input.value = '';
}

function toggleCausaQueima() {
    const recond = document.getElementById('recondicionamento').checked;
    const causa = document.getElementById('causaQueimaGroup');
    const causaInput = document.getElementById('causaQueima');

    if (recond) {
        causa.hidden = false;
        causaInput.value = 'Queimado';
    } else {
        causa.hidden = true;
        causaInput.value = '';
    }
}

document.getElementById('formOrcamento').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = new FormData(this);
    const nome = form.get('nome').trim();
    const telefone = form.get('telefone').replace(/\D/g, '');
    const placaMotor = form.get('placaMotor').trim();
    const cv = form.get('cv').trim();
    const rpm = form.get('rpm').trim();
    const causaQueima = form.get('causaQueima').trim();

    const erros = [];

    if (!nome) erros.push('Nome do cliente é obrigatório.');
    if (telefone.length < 10 || telefone.length > 11) erros.push('Telefone inválido (use DDD).');
    if (!placaMotor) erros.push('Dados da placa são obrigatórios.');
    if (!cv) erros.push('CV (Potência) é obrigatório.');
    if (!rpm) erros.push('RPM é obrigatório.');
    if (document.getElementById('recondicionamento').checked && !causaQueima) {
        erros.push('Causa da queima é obrigatória para Recondicionamento.');
    }

    if (erros.length > 0) {
        alert(erros.join('\n'));
        return;
    }

    let mensagem = `*ORÇAMENTO DE MOTOR ELÉTRICO*\n\n`;
    mensagem += `*Cliente:* ${nome}\n`;
    mensagem += `*Telefone:* ${telefone}\n\n`;
    mensagem += `*Dados da Placa:*\n${placaMotor}\n*CV:* ${cv}\n*RPM:* ${rpm}\n\n`;
    if (causaQueima) {
        mensagem += `*Causa da Queima:*\n${causaQueima}\n\n`;
    }
    mensagem += `*Serviços Solicitados:*\n`;

    const servicos = [
        ['rolamento', 'Rolamento', 'rolamentoDesc'],
        ['recondicionamento', 'Recondicionamento', ''],
        ['revisao', 'Revisão', 'revisaoDesc'],
        ['pintura', 'Pintura', 'pinturaDesc'],
        ['torno', 'Torno', 'tornoDesc'],
        ['selo', 'Selo', 'seloDesc'],
        ['capacitor', 'Capacitor', 'capacitorDesc'],
        ['parafusos', 'Parafusos', 'parafusosDesc'],
        ['polia', 'Polia', 'poliaDesc'],
        ['ventilador', 'Ventilador', 'ventiladorDesc'],
        ['platinado', 'Platinado', 'platinadoDesc'],
        ['centrifugo', 'Centrífugo', 'centrifugoDesc']
    ];

    servicos.forEach(([key, label, descKey]) => {
        if (form.get(key)) {
            const desc = descKey ? form.get(descKey).trim() : '';
            mensagem += `- ${label}: ${desc || 'OK'}\n`;
        }
    });

    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
});
