---
id: ko_konnect_preproduction
slug: konnect-preproduction
title: Paiement Konnect en pré-production
summary: État de prudence concernant l’intégration Konnect dans Dawajin Pro.
language: fr
status: published
version: 1.0.0
author: author_dawajin_team
reviewer: author_dawajin_team
trustLevel: product-critical
freshness: frequent
entities: entity_konnect_preproduction, entity_payment
citations: citation_konnect_preproduction_review
canonicalUrl: https://dawajinpro.tn/fr/help/konnect-preproduction
---

L’intégration Konnect doit être considérée comme pré-production tant que le compte marchand n’est pas activé, validé et testé avec des paiements réels contrôlés.

La documentation publique ne doit pas présenter Konnect comme pleinement opérationnel en production avant validation effective du compte marchand, des webhooks et du cycle complet de paiement.

Les validations importantes comprennent notamment : statut confirmé côté serveur, montant attendu, devise attendue, référence de paiement non réutilisée, cohérence avec l’abonnement concerné et garde explicite de production.

Cette page sert à documenter la prudence produit. Elle ne constitue pas une annonce de disponibilité commerciale du paiement en production.
